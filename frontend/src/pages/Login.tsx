
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    let demoEmail = "";
    let demoPassword = "";
    
    switch (role) {
      case "admin":
        demoEmail = "admin@example.com";
        demoPassword = "admin123";
        break;
      case "delivery":
        demoEmail = "delivery@example.com";
        demoPassword = "delivery123";
        break;
      case "customer":
        demoEmail = "customer@example.com";
        demoPassword = "customer123";
        break;
    }
    
    try {
      await login(demoEmail, demoPassword);
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/50">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="neo">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-primary gap-2 group"
                disabled={isLoading}
              >
                <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                )}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Demo Accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-auto py-2"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                <div className="flex flex-col items-center text-xs">
                  <span className="font-medium">Admin</span>
                  <span className="text-muted-foreground text-[10px]">Demo</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-2"
                onClick={() => handleDemoLogin("delivery")}
                disabled={isLoading}
              >
                <div className="flex flex-col items-center text-xs">
                  <span className="font-medium">Delivery</span>
                  <span className="text-muted-foreground text-[10px]">Demo</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-2"
                onClick={() => handleDemoLogin("customer")}
                disabled={isLoading}
              >
                <div className="flex flex-col items-center text-xs">
                  <span className="font-medium">Customer</span>
                  <span className="text-muted-foreground text-[10px]">Demo</span>
                </div>
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => navigate("/")}
            >
              Back to home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
