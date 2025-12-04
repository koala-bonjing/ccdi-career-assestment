// components/Auth/AuthComponent.tsx
import React, { useState } from 'react';
import SignupForm from '../SignUpForm/SignUpForm';
import LoginForm from '../LoginForm/LoginForm';
import { useAuth } from "../../../context/AuthContext"
import { useUserStore } from "../../../../store/useUserStore";

interface AuthComponentProps {
  initialMode: 'signup' | 'login';
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  preferredCourse: string;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ initialMode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const { login } = useAuth();
  const { setCurrentUser } = useUserStore();

  const handleLoginSuccess = (userData: UserData): void => {
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