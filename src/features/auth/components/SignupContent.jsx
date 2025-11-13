import { useState } from "react";
import SignupCard from "../../../ui/auth/SignupCard";

const SignupContent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate actual signup logic
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Signup attempt", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    />
  );
};

export default SignupContent;

