import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, User, Award, Code, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  phone_number: string | null;
  parsed_skills: string[];
  experience_years: number | null;
  education_level: string | null;
  predicted_category: string | null;
  confidence_score: number | null;
  category_name?: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      
      // Fetch resumes with job category names
      const { data: resumes, error } = await supabase
        .from('resumes')
        .select(`
          *,
          job_categories (
            name
          )
        `)
        .eq('status', 'processed')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data and extract categories
      const transformedCandidates = resumes?.map(resume => ({
        id: resume.id,
        candidate_name: resume.candidate_name,
        candidate_email: resume.candidate_email,
        phone_number: resume.phone_number,
        parsed_skills: resume.parsed_skills || [],
        experience_years: resume.experience_years,
        education_level: resume.education_level,
        predicted_category: resume.predicted_category,
        confidence_score: resume.confidence_score,
        category_name: resume.job_categories?.name || 'General'
      })) || [];

      setCandidates(transformedCandidates);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(transformedCandidates.map(c => c.category_name).filter(Boolean))];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getExperienceLevel = (years: number | null) => {
    if (!years) return "Not specified";
    if (years <= 2) return "Junior (0-2 years)";
    if (years <= 5) return "Mid-level (3-5 years)";
    return "Senior (5+ years)";
  };

  const experienceLevels = ["Junior (0-2 years)", "Mid-level (3-5 years)", "Senior (5+ years)"];
  
  const filteredCandidates = candidates.filter(candidate => {
    const name = candidate.candidate_name || '';
    const skills = candidate.parsed_skills || [];
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || candidate.category_name === categoryFilter;
    const matchesExperience = experienceFilter === "all" || getExperienceLevel(candidate.experience_years) === experienceFilter;
    
    return matchesSearch && matchesCategory && matchesExperience;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 80) return "bg-primary text-primary-foreground";
    if (score >= 70) return "bg-yellow-500 text-white";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Candidate Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Review and manage AI-processed candidates
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                    <p className="text-3xl font-bold">{candidates.length}</p>
                  </div>
                  <User className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Match (90%+)</p>
                    <p className="text-3xl font-bold text-success">
                      {candidates.filter(c => (c.confidence_score || 0) >= 90).length}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                    <p className="text-3xl font-bold">{categories.length}</p>
                  </div>
                  <Code className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Match Score</p>
                    <p className="text-3xl font-bold">
                      {candidates.length > 0 
                        ? Math.round(candidates.reduce((acc, c) => acc + (c.confidence_score || 0), 0) / candidates.length)
                        : 0}%
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find candidates by name, skills, category, or experience level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Job Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {experienceLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Processed Candidates ({filteredCandidates.length})</CardTitle>
              <CardDescription>Candidates analyzed with NLP resume scanning</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading candidates...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="border rounded-lg p-6 hover:bg-card-hover transition-colors card-hover"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold">{candidate.candidate_name || 'Unknown Candidate'}</h3>
                            <Badge className={`${getScoreColor(candidate.confidence_score || 0)} font-bold`}>
                              {candidate.confidence_score || 0}% Match
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Job Category</p>
                              <p className="font-medium">{candidate.category_name || 'General'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Experience Level</p>
                              <p className="font-medium">{getExperienceLevel(candidate.experience_years)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                              <p className="text-sm">{candidate.candidate_email || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                              <p className="text-sm">{candidate.phone_number || 'Not provided'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Key Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {candidate.parsed_skills && candidate.parsed_skills.length > 0 ? (
                                candidate.parsed_skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No skills extracted</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Resume
                          </Button>
                          <Button size="sm">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredCandidates.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                      <p className="text-muted-foreground">
                        {candidates.length === 0 
                          ? "Upload and process some resumes to see candidates here."
                          : "Try adjusting your search terms or filters to find more candidates."
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;