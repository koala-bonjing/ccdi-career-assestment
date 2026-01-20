// src/components/Auth/LoginForm/LoginForm.tsx
import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Cpu,
  GraduationCap,
  Users,
  Target,
  Brain,
  Shield,
  EyeOff,
  Eye,
  User,
} from "lucide-react";
import type { LoginFormProps, FormData, Message } from "./types/login";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onLoginSuccess,
}) => {
  // const BASE_URL = import.meta.env.BASE_URL;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      setMessage({ type: "success", text: response.data.message });

      navigate("/welcome");

      // Call the success handler which will update auth context and navigate
      onLoginSuccess(response.data.user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Login failed",
        });
      } else {
        setMessage({
          type: "error",
          text: "Login failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="container-fluid min-vh-100"
      style={{
        background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
      }}
    >
      <div className="row min-vh-100">
        {/* Left Side - CCDI System Introduction */}
        <div className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center text-white p-5">
          <div className="text-center" style={{ maxWidth: "700px" }}>
            {/* Header */}
            <div className="mb-1">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <Cpu
                  size={48}
                  className="text-white me-3"
                  style={{ color: "#EC2326" }}
                />
                <h1 className="display-4 fw-bold text-white">
                  CCDI Automated Career Assessment Test
                </h1>
              </div>
              <p className="lead mb-5 fs-5" style={{ color: "#ffffffcc" }}>
                Discover Your Perfect Academic Path at Computer Communication
                Development Institute
              </p>
            </div>

            {/* System Purpose */}
            <div
              className="rounded p-4 mb-5 border"
              style={{ backgroundColor: "#1C6CB3", borderColor: "#2B3176" }}
            >
              <p className="mb-3">
                The <strong>CCDI Automated Career Assessment Test</strong> is
                developed to assist incoming students of CCDI Sorsogon in
                identifying academic programs that best align with their
                interests, skills, and potential career paths.
              </p>
              <p className="mb-0">
                Through intelligent AI-based analysis and systematic evaluation,
                this platform helps you gain deeper self-awareness and make
                well-informed decisions about your academic future.
              </p>
            </div>

            {/* Features Grid */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="d-flex align-items-start text-start">
                  <GraduationCap
                    size={28}
                    className="me-3 mt-1 flex-shrink-0"
                    style={{ color: "#EC2326" }}
                  />
                  <div>
                    <h5 className="fw-bold">Program Alignment</h5>
                    <p className="small mb-0" style={{ color: "#ffffffcc" }}>
                      Matches your profile with CCDI's academic programs:
                      Computer Science, IT, Information Systems, and more
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start text-start">
                  <Brain
                    size={28}
                    className="me-3 mt-1 flex-shrink-0"
                    style={{ color: "#EC2326" }}
                  />
                  <div>
                    <h5 className="fw-bold">AI-Powered Analysis</h5>
                    <p className="small mb-0" style={{ color: "#ffffffcc" }}>
                      Leverages Gemini AI for intelligent, data-driven
                      recommendations and personalized insights
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start text-start">
                  <Target
                    size={28}
                    className="me-3 mt-1 flex-shrink-0"
                    style={{ color: "#EC2326" }}
                  />
                  <div>
                    <h5 className="fw-bold">Career Readiness</h5>
                    <p className="small mb-0" style={{ color: "#ffffffcc" }}>
                      Reduces uncertainty and promotes career readiness from the
                      start of your academic journey
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start text-start">
                  <Users
                    size={28}
                    className="me-3 mt-1 flex-shrink-0"
                    style={{ color: "#EC2326" }}
                  />
                  <div>
                    <h5 className="fw-bold">Personalized Guidance</h5>
                    <p className="small mb-0" style={{ color: "#ffffffcc" }}>
                      Tailored feedback that reflects your unique interests,
                      skills, and learning preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Data Protection Notice */}
            <div
              className="rounded p-4 border"
              style={{ backgroundColor: "#A41D31", borderColor: "#EC2326" }}
            >
              <div className="d-flex align-items-center mb-3">
                <Shield size={24} className="text-white me-2" />
                <h6 className="mb-0 text-white fw-bold">
                  Data Privacy & Protection Notice
                </h6>
              </div>
              <p className="small mb-2" style={{ color: "#ffffffcc" }}>
                This system collects and processes personal information
                including your email address, assessment responses, and academic
                preferences to generate personalized career recommendations.
              </p>
              <p className="small mb-0" style={{ color: "#ffffffcc" }}>
                Your data is protected using enterprise-grade security measures
                and handled in strict compliance with data privacy regulations.
                All information is used solely for academic guidance purposes
                within CCDI's educational framework.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white p-5">
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <Cpu size={32} className="me-2" style={{ color: "#A41D31" }} />
                <h2 className="fw-bold mb-0" style={{ color: "#2B3176" }}>
                  Welcome to CCDI
                </h2>
              </div>
              <p className="text-muted">
                Sign in to continue your career assessment
              </p>
            </div>

            {message.text && (
              <div
                className={`alert d-flex align-items-center ${
                  message.type === "success" ? "alert-success" : "alert-danger"
                } mb-4`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={16} className="me-2" />
                ) : (
                  <AlertCircle size={16} className="me-2" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                  style={{ color: "#2B3176" }}
                >
                  Student's Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={18} className="text-muted" />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                  style={{ color: "#2B3176" }}
                >
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control border-start-0"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="form-label fw-semibold"
                  style={{ color: "#2B3176" }}
                >
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center border-start-0 border-end-0"
                    onClick={togglePasswordVisibility}
                    style={{ width: "44px" }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-muted" />
                    ) : (
                      <Eye size={20} className="text-muted" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 py-3 mb-3 fw-semibold text-white"
                style={{
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #EC2326 0%, #A41D31 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  "Continue Assessment"
                )}
              </button>

              <div className="text-center">
                <span className="text-muted">New to CCDI Assessment? </span>
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="btn btn-link p-0 ms-1 fw-semibold text-decoration-none"
                  style={{ color: "#1C6CB3" }}
                >
                  Start Your Journey
                </button>
              </div>
            </form>

            {/* Mobile Privacy Notice */}
            <div className="d-lg-none mt-5">
              <div className="alert alert-warning">
                <div className="d-flex align-items-center mb-2">
                  <Shield
                    size={16}
                    className="me-2"
                    style={{ color: "#A41D31" }}
                  />
                  <strong style={{ color: "#A41D31" }}>
                    Data Privacy Notice
                  </strong>
                </div>
                <small className="text-muted">
                  This system collects personal information for academic
                  guidance purposes. Your data is protected and handled
                  according to CCDI's privacy policy and data protection
                  standards.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
