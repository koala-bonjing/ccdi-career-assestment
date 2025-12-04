export interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (user: User) => void;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  preferredCourse: string;
  
}

export interface FormData {
  email: string;
  password: string;
}

export interface Message {
  type: "success" | "error" | "";
  text: string;
}