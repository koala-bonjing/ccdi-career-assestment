// src/components/Auth/SignupForm/SignupForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, Book, CheckCircle, AlertCircle } from "lucide-react";
import { BASE_URL } from "../../../config/constants";
import "./SignUpForm.css";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    preferredCourse: "Undecided",
    agreeToTerms: false,
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const courses = [
    { value: "Undecided", label: "I'm not sure yet" },
    { value: "BSCS", label: "Computer Science (BSCS)" },
    { value: "BSIT", label: "Information Technology (BSIT)" },
    { value: "BSIS", label: "Information Systems (BSIS)" },
    { value: "EE", label: "Electrical Engineering (EE)" },
  ];

  const handleSignup = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
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
        // After successful verification, switch to login
        onSwitchToLogin();
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/resend-code`, {
        email: formData.email,
      });
      setMessage({ type: "success", text: response.data.message });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend code",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Verify Your Email</h2>
          <p className="auth-subtitle">
            We sent a 6-digit verification code to{" "}
            <strong>{formData.email}</strong>
          </p>

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
                onChange={(e) =>
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
              {loading ? "Verifying..." : "Verify Email"}
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to start your career assessment</p>

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
              onChange={(e) =>
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
              onChange={(e) =>
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
              onChange={(e) =>
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
              onChange={(e) =>
                setFormData({ ...formData, preferredCourse: e.target.value })
              }
              className="input-field"
            >
              {courses.map((course) => (
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
              onChange={(e) =>
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
            {loading ? "Creating Account..." : "Sign Up"}
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
