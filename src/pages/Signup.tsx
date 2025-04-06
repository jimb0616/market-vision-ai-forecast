
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, BarChart2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Agreement required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created successfully",
        description: "Welcome to Market Oracle!",
      });
      
      // In a real app, you would:
      // 1. Send signup data to backend
      // 2. Create user account
      // 3. Redirect to plans or dashboard
      
      // For demo, we'll just redirect
      window.location.href = "/plans";
    }, 1500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel - Signup form */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">Market<span className="text-blue-500">Oracle</span></span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign up to access AI-powered stock predictions
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
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
                  <Label htmlFor="password">Password</Label>
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
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-500 hover:text-blue-600">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-500 hover:text-blue-600">
                      privacy policy
                    </Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right panel - Features */}
      <div className="hidden md:block relative bg-market-navy">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="glass-card rounded-xl p-8 max-w-md backdrop-blur-md space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Why join Market Oracle?</h3>
            
            <ul className="space-y-4">
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-blue-500 mr-2 shrink-0" />
                <div>
                  <p className="font-medium text-white">AI-Powered Predictions</p>
                  <p className="text-sm text-gray-400">Our models analyze thousands of data points to predict stock movements with high accuracy.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-blue-500 mr-2 shrink-0" />
                <div>
                  <p className="font-medium text-white">Real-time Alerts</p>
                  <p className="text-sm text-gray-400">Get instant notifications when our AI detects potential trading opportunities.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-blue-500 mr-2 shrink-0" />
                <div>
                  <p className="font-medium text-white">Premium Data Visualization</p>
                  <p className="text-sm text-gray-400">Interactive charts and heatmaps to help you understand market trends at a glance.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-blue-500 mr-2 shrink-0" />
                <div>
                  <p className="font-medium text-white">Risk Assessment</p>
                  <p className="text-sm text-gray-400">Each prediction comes with a confidence score to help you make informed decisions.</p>
                </div>
              </li>
            </ul>
            
            <div className="pt-4 text-center">
              <p className="text-gray-300 text-sm mb-2">Start with a 7-day free trial</p>
              <Link to="/" className="flex items-center justify-center text-blue-400 hover:text-blue-300 font-medium">
                Learn more about our features
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
