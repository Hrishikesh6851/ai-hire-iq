import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResumeAnalysis {
  candidate_name: string | null;
  candidate_email: string | null;
  phone_number: string | null;
  parsed_skills: string[];
  experience_years: number | null;
  education_level: string | null;
  predicted_category: string | null;
  confidence_score: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, fileName, uploadedBy } = await req.json();
    console.log('Processing resume:', fileName);

    // Download and extract text from the resume file
    console.log('Downloading file from:', fileUrl);
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      console.error('File download failed:', fileResponse.status, fileResponse.statusText);
      throw new Error(`Failed to download resume file: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    console.log('File downloaded successfully, content type:', fileResponse.headers.get('content-type'));
    const arrayBuffer = await fileResponse.arrayBuffer();
    
    // For now, we'll use a simple approach - in production, you'd want proper PDF parsing
    // Convert binary to base64 then send to OpenAI for text extraction
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    console.log('File size:', arrayBuffer.byteLength, 'bytes, Extension:', fileExtension);
    
    // Extract text content using OpenAI
    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. I will provide you with a resume file (it may be PDF, DOCX, or TXT format). 
            Your task is to extract key information and return it as valid JSON:
            {
              "candidate_name": "Full name of candidate",
              "candidate_email": "email@example.com",
              "phone_number": "+1234567890",
              "parsed_skills": ["skill1", "skill2", "skill3"],
              "experience_years": 5,
              "education_level": "Bachelor's/Master's/PhD/High School",
              "summary": "Brief professional summary"
            }
            
            Rules:
            - Extract skills as an array of strings (technologies, tools, programming languages, frameworks, etc.)
            - Calculate experience_years as total years of professional experience
            - Use null for missing information
            - Be precise and extract only what's clearly stated
            - If the file content is not readable or corrupted, return null values`
          },
          {
            role: 'user',
            content: `Please parse this resume file. File extension: ${fileExtension}. 
            
            The file content is base64 encoded: ${base64Content.substring(0, 50000)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    console.log('OpenAI extraction response status:', extractionResponse.status);
    
    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${extractionResponse.status}`);
    }

    const extractionData = await extractionResponse.json();
    console.log('OpenAI response:', extractionData.choices[0].message.content);
    
    let extractedInfo;
    try {
      extractedInfo = JSON.parse(extractionData.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback with basic info
      extractedInfo = {
        candidate_name: null,
        candidate_email: null,
        phone_number: null,
        parsed_skills: [],
        experience_years: null,
        education_level: null,
        summary: null
      };
    }
    console.log('Extracted info:', extractedInfo);

    // Get job categories for classification
    const { data: categories } = await supabase
      .from('job_categories')
      .select('id, name, skills_keywords');

    // Classify the resume into a job category using OpenAI
    const classificationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert job classifier. Based on the candidate's skills, classify them into the most appropriate job category.
            
            Available categories: ${categories?.map(cat => `${cat.name}: ${cat.skills_keywords?.join(', ') || 'General'}`).join('; ')}
            
            Return only the category name that best matches the candidate's skills. If no good match, return "General".`
          },
          {
            role: 'user',
            content: `Classify this candidate based on their skills: ${extractedInfo.parsed_skills?.join(', ') || 'No skills listed'}`
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      }),
    });

    const classificationData = await classificationResponse.json();
    const predictedCategoryName = classificationData.choices[0].message.content.trim();
    
    // Find the category ID
    const matchedCategory = categories?.find(cat => 
      cat.name.toLowerCase() === predictedCategoryName.toLowerCase()
    );
    
    // Calculate confidence score based on skill match
    let confidenceScore = 0.7; // Base confidence
    if (matchedCategory && extractedInfo.parsed_skills) {
      const skillMatch = extractedInfo.parsed_skills.some((skill: string) =>
        matchedCategory.skills_keywords?.some((keyword: string) =>
          skill.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(skill.toLowerCase())
        )
      );
      confidenceScore = skillMatch ? 0.9 : 0.6;
    }

    // Save the processed resume to database
    const resumeData = {
      file_name: fileName,
      file_url: fileUrl,
      uploaded_by: uploadedBy,
      raw_text: `Processed ${fileExtension} file - ${arrayBuffer.byteLength} bytes`,
      candidate_name: extractedInfo.candidate_name,
      candidate_email: extractedInfo.candidate_email,
      phone_number: extractedInfo.phone_number,
      parsed_skills: extractedInfo.parsed_skills || [],
      experience_years: extractedInfo.experience_years,
      education_level: extractedInfo.education_level,
      predicted_category: matchedCategory?.id || null,
      confidence_score: Math.round(confidenceScore * 100),
      status: 'processed'
    };

    console.log('Saving resume data:', { ...resumeData, raw_text: 'truncated for logging' });

    const { data: resume, error: insertError } = await supabase
      .from('resumes')
      .insert(resumeData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save resume: ${insertError.message}`);
    }

    console.log('Resume processed successfully:', resume.id);

    return new Response(JSON.stringify({
      success: true,
      resume_id: resume.id,
      analysis: {
        candidate_name: extractedInfo.candidate_name,
        predicted_category: predictedCategoryName,
        confidence_score: Math.round(confidenceScore * 100),
        skills_count: extractedInfo.parsed_skills?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in process-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error?.message || 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});