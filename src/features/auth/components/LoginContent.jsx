import { useState } from "react";
import LoginCard from "../../../ui/auth/LoginCard";

const LoginContent = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate actual login logic
    console.log("Login attempt", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    />
  );
};

export default LoginContent;
