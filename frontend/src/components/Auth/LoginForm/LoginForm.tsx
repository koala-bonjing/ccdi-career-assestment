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
    <div className="min-h-screen bg-gradient-to-br from-[#2B3176] via-[#1C6CB3] to-[#2B3176] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC2326]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-[#1C6CB3]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#A41D31]/10 to-[#EC2326]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Modern Hero Section */}
        <div className="hidden lg:flex flex-col w-7/12 p-12 text-white">
          {/* Header with modern badge */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#EC2326] to-[#A41D31] rounded-xl blur-md opacity-60"></div>
                <Cpu size={44} className="relative text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                  <Sparkles size={14} />
                  <span className="text-xs font-semibold">
                    AI-POWERED PLATFORM
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  CCDI Career Intelligence
                </h1>
              </div>
            </div>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              Discover your ideal academic path through intelligent AI analysis
              tailored specifically for CCDI Sorsogon students.
            </p>
          </div>

          {/* Modern features grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: <GraduationCap size={24} />,
                title: "Smart Program Matching",
                desc: "AI aligns your profile with CCDI's programs",
              },
              {
                icon: <Brain size={24} />,
                title: "Gemini AI Insights",
                desc: "Advanced AI-driven career recommendations",
              },
              {
                icon: <Target size={24} />,
                title: "Career Readiness",
                desc: "Reduce uncertainty with data-backed guidance",
              },
              {
                icon: <Users size={24} />,
                title: "Personalized Path",
                desc: "Tailored to your unique skills and interests",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#EC2326]/30 transition-all duration-300 hover:bg-white/10 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-gradient-to-br from-[#EC2326] to-[#A41D31] rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Enhanced privacy notice */}
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-[#A41D31]/20 to-[#EC2326]/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield size={20} />
                </div>
                <h4 className="font-bold text-lg">Your Privacy Matters</h4>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                We protect your assessment data with enterprise-grade security.
                All information is used exclusively for your academic guidance
                at CCDI.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Fingerprint size={12} />
                <span>GDPR Compliant • Encrypted Data • Academic Use Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Modern Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form header with gradient */}
              <div className="bg-gradient-to-r from-[#2B3176] to-[#1C6CB3] p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <Cpu size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
                  Welcome Future CCDI'ans!
                </h2>
                <p className="text-white/80">
                  Continue your personalized career assessment
                </p>
              </div>

              <div className="p-8">
                {/* Status Message */}
                {message.text && (
                  <div
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      message.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle size={20} className="flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="flex-shrink-0" />
                    )}
                    <span className="font-medium">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User size={16} className="text-[#2B3176]" />
                      Name
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-200 ${
                        isFocused.fullName
                          ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 transition-all duration-200"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("fullName")}
                        onBlur={() => handleBlur("fullName")}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-[#2B3176]" />
                      Email Address
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-200 ${
                        isFocused.email
                          ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 transition-all duration-200"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={() => handleBlur("email")}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-[#2B3176]" />
                      Password
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-200 ${
                        isFocused.password
                          ? "ring-2 ring-[#1C6CB3] ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 transition-all duration-200"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus("password")}
                        onBlur={() => handleBlur("password")}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff
                            size={20}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          />
                        ) : (
                          <Eye
                            size={20}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-4 px-6 text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue Assessment</span>
                          <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Signup Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600 mb-3">
                    New to CCDI Career Assessment?
                  </p>
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="inline-flex items-center gap-2 text-[#1C6CB3] font-semibold hover:text-[#2B3176] transition-colors group"
                  >
                    <span>Start Your Journey Here</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>

                {/* Mobile Privacy Notice */}
                <div className="lg:hidden mt-8 p-4 bg-gradient-to-r from-[#A41D31]/5 to-[#EC2326]/5 rounded-xl border border-[#EC2326]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield size={18} className="text-[#A41D31]" />
                    <span className="text-sm font-semibold text-gray-800">
                      Protected & Private
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
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
  );
};

export default LoginForm;
