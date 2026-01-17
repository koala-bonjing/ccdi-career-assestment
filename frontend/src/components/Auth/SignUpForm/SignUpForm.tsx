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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

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
      setTimeout(() => onSwitchToLogin(), 2000);
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
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="input-field"
            />
          </div>

          {/* Email */}
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
            disabled={loading}
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
                  You’re responsible for your account security. Notify us
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
                  <a
                    href="https://www.facebook.com/ccdisorsogoncity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CCDI Sorsogon
                  </a>
                  .
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
