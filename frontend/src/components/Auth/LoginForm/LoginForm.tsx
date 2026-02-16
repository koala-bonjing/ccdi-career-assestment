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
  Sparkles,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import type { LoginFormProps, FormData, Message } from "./types/login";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onLoginSuccess,
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

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

  const handleFocus = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle blue and red accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC2326]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-[#2B3176]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#A41D31]/5 to-[#1C6CB3]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Main container - reduced size */}
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Modern Hero Section (reduced size) */}
            <div className="hidden lg:flex flex-col w-6/12 p-8 bg-gradient-to-br from-[#2B3176] via-[#1C6CB3] to-[#2B3176] text-white">
              {/* Header with modern badge */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EC2326] to-[#A41D31] rounded-xl blur-md opacity-60"></div>
                    <Cpu size={36} className="relative text-white" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1">
                      <Sparkles size={12} />
                      <span className="text-xs font-semibold">
                        AI-POWERED PLATFORM
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      CCDI Career Intelligence
                    </h1>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                  Discover your ideal academic path through intelligent AI analysis
                  tailored specifically for CCDI Sorsogon students.
                </p>
              </div>

              {/* Modern features grid (compact) */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  {
                    icon: <GraduationCap size={18} />,
                    title: "Smart Program Matching",
                    desc: "AI aligns your profile with CCDI's programs",
                  },
                  {
                    icon: <Brain size={18} />,
                    title: "Gemini AI Insights",
                    desc: "Advanced AI-driven career recommendations",
                  },
                  {
                    icon: <Target size={18} />,
                    title: "Career Readiness",
                    desc: "Reduce uncertainty with data-backed guidance",
                  },
                  {
                    icon: <Users size={18} />,
                    title: "Personalized Path",
                    desc: "Tailored to your unique skills and interests",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-[#EC2326]/30 transition-all duration-300 hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-[#EC2326] to-[#A41D31] rounded-lg">
                        {feature.icon}
                      </div>
                      <h5 className="font-bold text-sm">{feature.title}</h5>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Enhanced privacy notice (compact) */}
              <div className="mt-auto">
                <div className="bg-gradient-to-r from-[#A41D31]/20 to-[#EC2326]/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                      <Shield size={16} />
                    </div>
                    <h4 className="font-bold text-sm">Your Privacy Matters</h4>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed mb-2">
                    We protect your assessment data with enterprise-grade security.
                    All information is used exclusively for your academic guidance
                    at CCDI.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <Fingerprint size={10} />
                    <span>GDPR Compliant • Encrypted Data • Academic Use Only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Modern Login Form (compact) */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                {/* Form header with gradient (compact) */}
                <div className="bg-gradient-to-r from-[#2B3176] to-[#1C6CB3] p-6 text-center rounded-t-2xl">
                  <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                    <Cpu size={22} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1 leading-snug">
                    Welcome Future CCDI'ans!
                  </h2>
                  <p className="text-white/80 text-sm">
                    Continue your personalized career assessment
                  </p>
                </div>

                <div className="p-6 bg-white rounded-b-2xl">
                  {/* Status Message */}
                  {message.text && (
                    <div
                      className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                        message.type === "success"
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle size={16} className="flex-shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="flex-shrink-0" />
                      )}
                      <span className="font-medium">{message.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Full Name Field - compact */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <User size={14} className="text-[#2B3176]" />
                        Name
                      </label>
                      <div
                        className={`relative rounded-lg transition-all duration-200 ${
                          isFocused.fullName
                            ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus("fullName")}
                          onBlur={() => handleBlur("fullName")}
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field - compact */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Mail size={14} className="text-[#2B3176]" />
                        Email Address
                      </label>
                      <div
                        className={`relative rounded-lg transition-all duration-200 ${
                          isFocused.email
                            ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={() => handleBlur("email")}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field - compact */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Lock size={14} className="text-[#2B3176]" />
                        Password
                      </label>
                      <div
                        className={`relative rounded-lg transition-all duration-200 ${
                          isFocused.password
                            ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus("password")}
                          onBlur={() => handleBlur("password")}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff
                              size={16}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            />
                          ) : (
                            <Eye
                              size={16}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button - compact */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue Assessment</span>
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </div>
                    </button>
                  </form>

                  {/* Signup Link */}
                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      New to CCDI Career Assessment?
                    </p>
                    <button
                      type="button"
                      onClick={onSwitchToSignup}
                      className="inline-flex items-center gap-1 text-[#1C6CB3] font-semibold text-sm hover:text-[#2B3176] transition-colors group"
                    >
                      <span>Start Your Journey Here</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>

                  {/* Mobile Privacy Notice */}
                  <div className="lg:hidden mt-4 p-3 bg-gradient-to-r from-[#A41D31]/5 to-[#EC2326]/5 rounded-lg border border-[#EC2326]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={14} className="text-[#A41D31]" />
                      <span className="text-xs font-semibold text-gray-800">
                        Protected & Private
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      Your assessment data is encrypted and used exclusively for
                      academic guidance at CCDI Sorsogon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;