import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import { authAPI } from "../../../api/auth";
import { toast } from "react-toastify";
import SignupCard from "../../../ui/auth/SignupCard";

const SignupContent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.success) {
        if (result?.requiresVerification) {
          // Redirect to email verification page
          navigate("/verify-email", {
            state: {
              email: result.email,
              message: result.message || "Please verify your email before logging in.",
            },
          });
        } else {
          // No verification required, go to dashboard
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  const handleFacebookLogin = () => {
    authAPI.facebookLogin();
  };

  return (
    <SignupCard
      title="Create Account"
      subtitle="Join CricTech and transform your cricket performance"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      showPassword={showPassword}
      onTogglePassword={togglePasswordVisibility}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
    />
  );
};

export default SignupContent;

