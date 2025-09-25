import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Brain, Upload, BarChart3, Mail, User, LogOut, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AI Resume Screen</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/upload" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/upload') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Upload Resume
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Contact
            </Link>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <Badge variant="secondary" className="text-xs">
                    HR
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;