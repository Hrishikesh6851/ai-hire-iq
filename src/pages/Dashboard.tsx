import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, User, Award, Code, Briefcase } from "lucide-react";

// Mock data for demonstration
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    skills: ["React", "JavaScript", "Python", "Machine Learning"],
    experience: "Senior (5+ years)",
    category: "Software Engineer",
    matchScore: 94,
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    name: "Michael Chen",
    skills: ["AWS", "Docker", "Kubernetes", "DevOps"],
    experience: "Mid-level (3-5 years)",
    category: "DevOps Engineer",
    matchScore: 89,
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "User Research"],
    experience: "Mid-level (3-5 years)",
    category: "UI/UX Designer",
    matchScore: 87,
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789"
  },
  {
    id: 4,
    name: "David Kim",
    skills: ["Data Science", "TensorFlow", "SQL", "Statistics"],
    experience: "Senior (5+ years)",
    category: "Data Scientist",
    matchScore: 92,
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    skills: ["Product Management", "Agile", "Analytics", "Strategy"],
    experience: "Senior (5+ years)",
    category: "Product Manager",
    matchScore: 85,
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 567-8901"
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  
  const categories = ["Software Engineer", "DevOps Engineer", "UI/UX Designer", "Data Scientist", "Product Manager"];
  const experienceLevels = ["Junior (0-2 years)", "Mid-level (3-5 years)", "Senior (5+ years)"];
  
  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || candidate.category === categoryFilter;
    const matchesExperience = experienceFilter === "all" || candidate.experience === experienceFilter;
    
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
                Review and manage shortlisted candidates
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
                    <p className="text-3xl font-bold">{mockCandidates.length}</p>
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
                      {mockCandidates.filter(c => c.matchScore >= 90).length}
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
                      {Math.round(mockCandidates.reduce((acc, c) => acc + c.matchScore, 0) / mockCandidates.length)}%
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
              <CardTitle>Shortlisted Candidates ({filteredCandidates.length})</CardTitle>
              <CardDescription>Candidates ranked by AI matching algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="border rounded-lg p-6 hover:bg-card-hover transition-colors card-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold">{candidate.name}</h3>
                          <Badge className={`${getScoreColor(candidate.matchScore)} font-bold`}>
                            {candidate.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Job Category</p>
                            <p className="font-medium">{candidate.category}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Experience Level</p>
                            <p className="font-medium">{candidate.experience}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                            <p className="text-sm">{candidate.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                            <p className="text-sm">{candidate.phone}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Key Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
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
                
                {filteredCandidates.length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters to find more candidates.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;