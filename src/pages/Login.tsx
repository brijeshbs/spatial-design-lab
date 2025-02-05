import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    toast({
      title: "Login Successful",
      description: "Welcome back to Mane!",
    });
    navigate("/projects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mane-background">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-mane-primary mb-6 text-center">
          Login to Mane
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mane-primary mb-1">
              Email
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mane-primary mb-1">
              Password
            </label>
            <Input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full"
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full bg-mane-secondary hover:bg-mane-primary">
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-mane-secondary hover:text-mane-primary">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;