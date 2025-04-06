
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, BarChart2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back to Market Oracle!",
      });
      
      // In a real app, you would:
      // 1. Send credentials to backend
      // 2. Store authentication token
      // 3. Redirect to dashboard
      
      // For demo, we'll just redirect
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel - Login form */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">Market<span className="text-blue-500">Oracle</span></span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to access your AI-powered stock predictions
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right panel - Decorative */}
      <div className="hidden md:block relative bg-market-navy">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="glass-card rounded-xl p-8 max-w-md backdrop-blur-md text-center space-y-6">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <BarChart2 className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Premium Stock Predictions</h3>
            <p className="text-gray-300">
              Access our AI-powered predictions that have helped traders achieve up to 27% better returns than traditional analysis.
            </p>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">93%</p>
                <p className="text-sm text-gray-400">Prediction Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">18K+</p>
                <p className="text-sm text-gray-400">Active Users</p>
              </div>
            </div>
            <Link to="/plans" className="flex items-center justify-center text-blue-400 hover:text-blue-300 text-sm font-medium">
              View our pricing plans
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
