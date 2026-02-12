// src/components/Auth/SignupForm/SignupForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Book,
  CheckCircle,
  AlertCircle,
  Cpu,
  Link,
} from "lucide-react";

import type {
  SignupFormProps,
  FormData,
  Message,
  Course,
} from "./types/sign-up";
import "./SignUpForm.css";
import { useAuth } from "../../../context/AuthContext";
import { useUserStore } from "../../../../store/useUserStore";

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setCurrentUser } = useUserStore();

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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  // Updated course list matching CCDI programs
  const courses: Course[] = [
    { value: "Undecided", label: "I'm not sure yet" },
    { value: "BSCS", label: "Computer Science (BSCS)" },
    { value: "BSIT", label: "Information Technology (BSIT)" },
    { value: "BSIS", label: "Information Systems (BSIS)" },
    {
      value: "BSET Electronics Technology",
      label: "Electronics Technology (BSET)",
    },
    {
      value: "BSET Electrical Technology",
      label: "Electrical Technology (BSET)",
    },
  ];

  // Check if email is already registered
  const checkEmailAvailability = async (email: string): Promise<void> => {
    if (!email || !email.includes("@")) {
      setEmailError("");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/check-email`, {
        email,
      });

      if (response.data.exists) {
        setEmailError(
          "This email is already registered. Please use a different email or sign in.",
        );
      } else {
        setEmailError("");
      }
    } catch (error: unknown) {
      // If the endpoint doesn't exist yet, silently fail
      console.error("Email check failed:", error);
    }
  };

  // Check if username (full name) is already registered
  const checkNameAvailability = async (fullName: string): Promise<void> => {
    if (!fullName || fullName.trim().length < 2) {
      setNameError("");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/check-name`, {
        fullName: fullName.trim(),
      });

      if (response.data.exists) {
        setNameError(
          "This name is already registered. Please use your full legal name or a variation.",
        );
      } else {
        setNameError("");
      }
    } catch (error: unknown) {
      // If the endpoint doesn't exist yet, silently fail
      console.error("Name check failed:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Check for validation errors before submitting
    if (emailError) {
      setMessage({
        type: "error",
        text: "Please fix the email error before proceeding.",
      });
      setLoading(false);
      return;
    }

    if (nameError) {
      setMessage({
        type: "error",
        text: "Please fix the name error before proceeding.",
      });
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setMessage({
        type: "error",
        text: "Please agree to the Terms and Conditions and Privacy Policy.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        formData,
      );
      setMessage({ type: "success", text: response.data.message });
      setStep("verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Signup failed";

        // Handle specific duplicate errors from backend
        if (
          errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("already")
        ) {
          setEmailError(errorMessage);
        } else if (
          errorMessage.toLowerCase().includes("name") &&
          errorMessage.toLowerCase().includes("already")
        ) {
          setNameError(errorMessage);
        }

        setMessage({
          type: "error",
          text: errorMessage,
        });
      } else {
        setMessage({
          type: "error",
          text: "An unexpected error occurred.",
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
      
      // Auto-login after successful verification
      try {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        const userData = loginResponse.data.user;
        const token = loginResponse.data.token;
        
        // Store token if provided
        if (token) {
          localStorage.setItem("token", token);
        }
        
        // Update auth context and user store
        login(userData);
        setCurrentUser({
          _id: userData._id || userData.id,
          name: userData.fullName || userData.name,
          email: userData.email,
          preferredCourse: userData.preferredCourse,
        });

        console.log("✅ Auto-login successful, redirecting to /welcome");
        
        // Redirect to welcome page after auto-login
        setTimeout(() => {
          navigate("/welcome");
        }, 1500);
      } catch (loginError) {
        console.error("❌ Auto-login failed:", loginError);
        // If auto-login fails, just redirect to login
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      }
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

  // === Verification Step ===
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
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
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
                  />
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

  // === Signup Step ===
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
          {/* Full Name */}
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                setNameError("");
              }}
              onBlur={(e) => checkNameAvailability(e.target.value)}
              required
              className={`input-field ${nameError ? "is-invalid" : ""}`}
            />
          </div>
          {nameError && (
            <div
              className="text-danger small mb-2"
              style={{ marginTop: "-0.5rem" }}
            >
              <AlertCircle size={14} className="me-1" />
              {nameError}
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setEmailError("");
              }}
              onBlur={(e) => checkEmailAvailability(e.target.value)}
              required
              className={`input-field ${emailError ? "is-invalid" : ""}`}
            />
          </div>
          {emailError && (
            <div
              className="text-danger small mb-2"
              style={{ marginTop: "-0.5rem" }}
            >
              <AlertCircle size={14} className="me-1" />
              {emailError}
            </div>
          )}

          {/* Password */}
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

          {/* Preferred Course */}
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

          {/* Terms Agreement */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              className="checkbox"
              required
            />
            <label htmlFor="agreeToTerms" className="checkbox-label">
              I agree to the{" "}
              <button
                type="button"
                className="btn btn-link p-0 m-0 align-baseline text-decoration-underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
              >
                Terms and Conditions
              </button>
              {" and "}
              <button
                type="button"
                className="btn btn-link p-0 m-0 align-baseline text-decoration-underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError || !!nameError}
            className="auth-button primary"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
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

      {/* Terms Modal */}
      {showTerms && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowTerms(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="termsModalLabel"
        >
          <div
            className="modal-dialog modal-dialog-scrollable modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="termsModalLabel">
                  Terms and Conditions
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTerms(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body policy-body">
                <p>
                  <strong>Last Updated:</strong> January 2026
                </p>
                <h6>1. Acceptance of Terms</h6>
                <p>
                  By signing up, you agree to these Terms and our Privacy
                  Policy. If you disagree, do not use this service.
                </p>

                <h6>2. Eligibility</h6>
                <p>
                  You must be at least 19 years old and a student or prospective
                  student of CCDI Sorsogon.
                </p>

                <h6>3. Account Responsibility</h6>
                <p>
                  You're responsible for your account security. Notify us
                  immediately of unauthorized access.
                </p>

                <h6>4. Service Use</h6>
                <p>
                  Our career assessments are guidance tools — not binding
                  academic or career advice.
                </p>

                <h6>5. Limitation of Liability</h6>
                <p>
                  We are not liable for indirect damages or decisions made based
                  on assessment results.
                </p>

                <h6>6. Governing Law</h6>
                <p>
                  These Terms are governed by the laws of the Republic of the
                  Philippines.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTerms(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowPrivacy(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacyModalLabel"
        >
          <div
            className="modal-dialog modal-dialog-scrollable modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="privacyModalLabel">
                  Privacy Policy
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPrivacy(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body policy-body">
                <p>
                  <strong>Last Updated:</strong> January 2026
                </p>
                <h6>1. Information We Collect</h6>
                <p>
                  Full name, email, password (hashed), and preferred course.
                </p>

                <h6>2. How We Use Your Data</h6>
                <p>
                  To create your account, verify email, personalize guidance,
                  and improve our service.
                </p>

                <h6>3. Data Sharing</h6>
                <p>
                  We do <strong>not sell</strong> your data. Shared only with
                  trusted service providers (e.g., email) under strict
                  confidentiality.
                </p>

                <h6>4. Your Rights (RA 10173)</h6>
                <p>
                  You may access, correct, or delete your data. Contact us via
                  our Facebook Account{" "}
                  <div className="flex flex-row">
                    <a
                      href="https://www.facebook.com/ccdisorsogoncity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                    >
                      CCDI Sorsogon
                      <Link size={14} className="ml-1" />
                    </a>
                    .
                  </div>
                  
                </p>

                <h6>5. Security</h6>
                <p>
                  Passwords are securely hashed. All data transmitted via HTTPS
                  encryption.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPrivacy(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;