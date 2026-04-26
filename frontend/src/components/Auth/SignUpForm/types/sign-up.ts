export interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export interface FormData {
  fullName: string;
  email: string;
  password: string;
  preferredCourse: string;
  agreeToTerms: boolean;
  address: string
  school: string
}

export interface Message {
  type: "success" | "error" | "";
  text: string;
}

export interface Course {
  value: string;
  label: string;
}