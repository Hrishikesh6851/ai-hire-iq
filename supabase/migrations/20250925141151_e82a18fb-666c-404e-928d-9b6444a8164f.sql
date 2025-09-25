-- Create user profiles table for HR users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  department TEXT DEFAULT 'HR',
  role TEXT DEFAULT 'recruiter',
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job categories table
CREATE TABLE public.job_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  skills_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resumes table for storing uploaded resume data
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT,
  candidate_name TEXT,
  candidate_email TEXT,
  phone_number TEXT,
  raw_text TEXT,
  parsed_skills TEXT[],
  experience_years INTEGER,
  education_level TEXT,
  predicted_category UUID REFERENCES public.job_categories(id),
  confidence_score DECIMAL(3,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default job categories
INSERT INTO public.job_categories (name, description, skills_keywords) VALUES
('Data Science', 'Data analysis, machine learning, and statistical modeling roles', ARRAY['python', 'sql', 'machine learning', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'r', 'statistics']),
('Web Development', 'Frontend and backend web development positions', ARRAY['javascript', 'react', 'node.js', 'html', 'css', 'vue', 'angular', 'express', 'mongodb', 'postgresql']),
('Mobile Development', 'iOS and Android application development', ARRAY['swift', 'kotlin', 'react native', 'flutter', 'ios', 'android', 'mobile', 'app development']),
('DevOps', 'Infrastructure, deployment, and system administration', ARRAY['docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'terraform', 'linux', 'ci/cd', 'monitoring']),
('HR & Recruiting', 'Human resources, talent acquisition, and people operations', ARRAY['recruiting', 'hr', 'talent acquisition', 'employee relations', 'hiring', 'onboarding', 'payroll']),
('Marketing', 'Digital marketing, content creation, and brand management', ARRAY['marketing', 'seo', 'content marketing', 'social media', 'analytics', 'campaigns', 'branding']),
('Sales', 'Business development, account management, and revenue generation', ARRAY['sales', 'business development', 'crm', 'lead generation', 'account management', 'negotiation']),
('Product Management', 'Product strategy, roadmap planning, and feature development', ARRAY['product management', 'roadmap', 'agile', 'scrum', 'user research', 'analytics', 'strategy']);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for job categories (readable by all authenticated users)
CREATE POLICY "Authenticated users can view job categories" 
ON public.job_categories 
FOR SELECT 
TO authenticated
USING (true);

-- Create RLS policies for resumes
CREATE POLICY "Users can view resumes they uploaded" 
ON public.resumes 
FOR SELECT 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can create resumes" 
ON public.resumes 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update resumes they uploaded" 
ON public.resumes 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete resumes they uploaded" 
ON public.resumes 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();