import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import { authAPI } from "../../../api/auth";
import LoginCard from "../../../ui/auth/LoginCard";

const LoginContent = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.success) {
        navigate("/dashboard");
      } else if (result?.requiresVerification) {
        // Redirect to email verification page
        navigate("/verify-email", {
          state: {
            email: result.email,
            message: result.error || "Please verify your email before logging in.",
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
    <LoginCard
      title="Welcome Back"
      subtitle="Sign in with your CricTech credentials"
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

export default LoginContent;
