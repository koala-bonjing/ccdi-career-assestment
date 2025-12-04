// src/components/Auth/SignupForm/SignupForm.tsx
import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Book,
  CheckCircle,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { BASE_URL } from "../../../config/constants";
import type {
  SignupFormProps,
  FormData,
  Message,
  Course,
} from "./types/sign-up";
import "./SignUpForm.css";

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    preferredCourse: "Undecided",
    agreeToTerms: false,
  });
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const courses: Course[] = [
    { value: "Undecided", label: "I'm not sure yet" },
    { value: "BSCS", label: "Computer Science (BSCS)" },
    { value: "BSIT", label: "Information Technology (BSIT)" },
    { value: "BSIS", label: "Information Systems (BSIS)" },
    { value: "EE", label: "Electrical Engineering (EE)" },
  ];

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!formData.agreeToTerms) {
      setMessage({
        type: "error",
        text: "Please agree to the terms and conditions",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        formData
      );
      setMessage({ type: "success", text: response.data.message });
      setStep("verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Signup failed",
        });
      } else {
        setMessage({
          type: "error",
          text: "Signup failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/verify-email`, {
        email: formData.email,
        code: verificationCode,
      });
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Verification failed",
        });
      } else {
        setMessage({
          type: "error",
          text: "Verification failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/resend-code`, {
        email: formData.email,
      });
      setMessage({ type: "success", text: response.data.message });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to resend code",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to resend code",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <Cpu size={32} className="text-primary me-2" />
              <h2 className="auth-title mb-0">Verify Your Email</h2>
            </div>
            <p className="auth-subtitle">
              We sent a 6-digit verification code to{" "}
              <strong style={{ color: "#A41D31" }}>{formData.email}</strong>
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleVerification} className="auth-form">
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="auth-button primary"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="auth-links">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="link-button"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setStep("signup")}
                className="link-button"
              >
                Back to Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Cpu size={32} className="text-primary me-2" />
            <h2 className="auth-title mb-0">Create Account</h2>
          </div>
          <p className="auth-subtitle">
            Sign up to start your career assessment
          </p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              minLength={6}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <Book className="input-icon" />
            <select
              value={formData.preferredCourse}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, preferredCourse: e.target.value })
              }
              className="input-field"
            >
              {courses.map((course: Course) => (
                <option key={course.value} value={course.value}>
                  {course.label}
                </option>
              ))}
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              className="checkbox"
            />
            <label htmlFor="agreeToTerms" className="checkbox-label">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button primary"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="auth-links">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
