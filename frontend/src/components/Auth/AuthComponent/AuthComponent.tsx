// components/Auth/AuthComponent.tsx
import React, { useState } from 'react';
import SignupForm from '../SignUpForm/SignUpForm';
import LoginForm from '../LoginForm/LoginForm';
import { useAuth } from "../../../context/AuthContext"
import { useUserStore } from "../../../../store/useUserStore";

const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const { setCurrentUser } = useUserStore();

  const handleLoginSuccess = (userData: any) => {
    // Update both auth context and user store
    login(userData);
    setCurrentUser({
      _id: userData.id,
      name: userData.fullName,
      email: userData.email,
      preferredCourse: userData.preferredCourse
    });
  };

  return (
    <div className="auth-page">
      {isLogin ? (
        <LoginForm 
          onSwitchToSignup={() => setIsLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <SignupForm 
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthComponent;