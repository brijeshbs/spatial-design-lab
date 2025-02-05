import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement actual registration logic
    toast({
      title: "Registration Successful",
      description: "Welcome to Mane!",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mane-background">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-mane-primary mb-6 text-center">
          Register for Mane
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mane-primary mb-1">
              Full Name
            </label>
            <Input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full"
              placeholder="Enter your full name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mane-primary mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full"
              placeholder="Confirm your password"
            />
          </div>
          <Button type="submit" className="w-full bg-mane-secondary hover:bg-mane-primary">
            Register
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-mane-secondary hover:text-mane-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;