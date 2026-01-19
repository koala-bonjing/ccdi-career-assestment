import { type User } from "./../../../../context/AuthContext";

export interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (user: User) => void;
}

export interface FormData {
  fullName: string;
  email: string;
  password: string;
}

export interface Message {
  type: "success" | "error" | "";
  text: string;
}
