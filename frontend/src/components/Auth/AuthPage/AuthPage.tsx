// src/components/Auth/AuthPage/AuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type User } from "../../../context/AuthContext";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignUpForm/SignUpForm";
import "./AuthPage.css";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (user: User) => {
    login(user);
    navigate("/welcome"); // Redirect to welcome screen after successful login
  };

  const handleSwitchToLogin = () => {
    setMode("login");
  };

  const handleSwitchToSignup = () => {
    setMode("signup");
  };

  return (
    <div className="auth-page-container">
      {mode === "login" ? (
        <LoginForm
          onSwitchToSignup={handleSwitchToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <SignupForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
};

export default AuthPage;
