import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  BarChart3, 
  Shield, 
  FileText, 
  Target, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Brain,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-ai-screening.jpg";

const Index = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Contextual Screening",
      description: "Advanced NLP-based analysis that goes beyond simple keyword matching to understand context, skills, and experience relevance.",
      highlights: ["94% Accuracy", "NLP Technology", "Context Aware"]
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Multi-format Support",
      description: "Seamlessly process resumes in PDF, DOCX, and TXT formats with intelligent text extraction and parsing capabilities.",
      highlights: ["PDF, DOCX, TXT", "Smart Parsing", "Bulk Upload"]
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Fair Candidate Selection",
      description: "Bias-aware machine learning models ensure fair evaluation while maintaining high accuracy in candidate assessment.",
      highlights: ["Bias Detection", "Fair Evaluation", "Compliance Ready"]
    }
  ];

  const stats = [
    { number: "70%", label: "Reduction in hiring time" },
    { number: "94%", label: "AI matching accuracy" },
    { number: "500+", label: "Companies using our solution" },
    { number: "50K+", label: "Resumes processed monthly" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/5"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Star className="h-3 w-3 mr-1" />
                  AI-Powered Recruitment
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Smarter Hiring with{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Resume Screening
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Reduce hiring time, improve accuracy, and never overlook top talent again. 
                  Our advanced AI system revolutionizes how you discover and evaluate candidates.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/auth">
                    <Upload className="h-5 w-5 mr-2" />
                    Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/contact">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Schedule Demo
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Free trial available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">No setup required</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-2xl blur-xl"></div>
              <img
                src={heroImage}
                alt="AI-powered resume screening system interface"
                className="relative w-full h-auto rounded-2xl shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Advanced Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Revolutionize Your Hiring Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with human insight 
              to deliver the most accurate and efficient resume screening solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Target className="h-3 w-3 mr-1" />
                The Problem
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Traditional Hiring is Broken
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  HR teams spend countless hours manually reviewing resumes, often missing qualified 
                  candidates due to unconscious bias or keyword-focused screening methods.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span>75% of qualified candidates are filtered out by keyword-only screening</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span>Average time-to-hire has increased by 40% in the past decade</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <span>Unconscious bias affects 80% of hiring decisions</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Our Solution
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                AI That Understands Context
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Our advanced AI system uses natural language processing and machine learning 
                  to understand the full context of each resume, not just keywords.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Contextual analysis reveals hidden talent and transferable skills</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Bias-aware algorithms ensure fair and diverse candidate selection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Automated ranking saves 70% of screening time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join hundreds of companies already using our AI-powered resume screening 
              to find the best talent faster and more fairly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/upload">
                  <Upload className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">
                  <Users className="h-5 w-5 mr-2" />
                  Schedule Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">AI Resume Screen</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revolutionizing recruitment with AI-powered resume screening technology.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
                <Link to="/upload" className="block hover:text-primary transition-colors">Upload Resume</Link>
                <Link to="/dashboard" className="block hover:text-primary transition-colors">Dashboard</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link to="/contact" className="block hover:text-primary transition-colors">Contact</Link>
                <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
                <a href="#" className="block hover:text-primary transition-colors">API Reference</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-primary transition-colors">About Us</a>
                <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AI Resume Screen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;