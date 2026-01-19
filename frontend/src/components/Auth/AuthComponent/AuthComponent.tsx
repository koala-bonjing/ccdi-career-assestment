// components/Auth/AuthComponent.tsx
import React, { useState } from "react";
import SignupForm from "../SignUpForm/SignUpForm";
import LoginForm from "../LoginForm/LoginForm";
import { useAuth, type User } from "../../../context/AuthContext";
import { useUserStore } from "../../../../store/useUserStore";

interface AuthComponentProps {
  initialMode: "signup" | "login";
}

const AuthComponent: React.FC<AuthComponentProps> = ({ initialMode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === "login");
  const { login } = useAuth();
  const { setCurrentUser } = useUserStore();

  const handleLoginSuccess = (userData: User): void => {
    // Update both auth context and user store
    login(userData);
    setCurrentUser({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: userData._id || (userData as any).id, 
      name: userData.fullName || userData.name,
      email: userData.email ,
      preferredCourse: userData.preferredCourse,
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
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthComponent;
