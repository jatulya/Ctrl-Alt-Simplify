import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, ShieldCheck, Heart } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just navigate to home
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3 mr-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">NutriPal</h1>
          </div>
          <p className="text-muted-foreground">Your personal nutrition companion</p>
        </div>

        <Card className="shadow-card border-border/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your NutriPal account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have an account? Sign up for free
              </p>
              
              {/* Features showcase */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/20">
                <div className="text-center">
                  <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Allergen Safe</p>
                </div>
                <div className="text-center">
                  <Heart className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Diet Goals</p>
                </div>
                <div className="text-center">
                  <Leaf className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Healthy Living</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;