import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Book,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Brain,
  Target,
  Star,
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
import LOGO_Alt from "../../../assets/logoCCDI.png";

// ── Bicol Region complete municipality/city data ──────────────────────────────
const BICOL_DATA: Record<string, string[]> = {
  Sorsogon: [
    "Barcelona",
    "Bulan",
    "Bulusan",
    "Casiguran",
    "Castilla",
    "Donsol",
    "Gubat",
    "Irosin",
    "Juban",
    "Magallanes",
    "Matnog",
    "Pilar",
    "Prieto Diaz",
    "Sta. Magdalena",
    "Sorsogon City",
  ],
  Albay: [
    "Bacacay",
    "Camalig",
    "Daraga",
    "Guinobatan",
    "Jovellar",
    "Legazpi City",
    "Libon",
    "Ligao City",
    "Malilipot",
    "Malinao",
    "Manito",
    "Oas",
    "Pio Duran",
    "Polangui",
    "Rapu-Rapu",
    "Santo Domingo",
    "Tabaco City",
    "Tiwi",
  ],
  "Camarines Norte": [
    "Basud",
    "Capalonga",
    "Daet",
    "Jose Panganiban",
    "Labo",
    "Mercedes",
    "Paracale",
    "San Lorenzo Ruiz",
    "San Vicente",
    "Santa Elena",
    "Talisay",
    "Vinzons",
  ],
  "Camarines Sur": [
    "Baao",
    "Balatan",
    "Bato",
    "Bombon",
    "Buhi",
    "Bula",
    "Cabusao",
    "Calabanga",
    "Camaligan",
    "Canaman",
    "Caramoan",
    "Del Gallego",
    "Gainza",
    "Garchitorena",
    "Goa",
    "Iriga City",
    "Lagonoy",
    "Libmanan",
    "Lupi",
    "Magarao",
    "Milaor",
    "Minalabac",
    "Nabua",
    "Naga City",
    "Ocampo",
    "Pamplona",
    "Pasacao",
    "Pili",
    "Presentacion",
    "Ragay",
    "Sagñay",
    "San Fernando",
    "San Jose",
    "Sipocot",
    "Siruma",
    "Tigaon",
    "Tinambac",
  ],
  Catanduanes: [
    "Bagamanoc",
    "Baras",
    "Bato",
    "Caramoran",
    "Gigmoto",
    "Pandan",
    "Panganiban",
    "San Andres",
    "San Miguel",
    "Viga",
    "Virac",
  ],
  Masbate: [
    "Aroroy",
    "Baleno",
    "Balud",
    "Batuan",
    "Cataingan",
    "Cawayan",
    "Claveria",
    "Dimasalang",
    "Esperanza",
    "Mandaon",
    "Masbate City",
    "Milagros",
    "Mobo",
    "Monreal",
    "Palanas",
    "Pio V. Corpuz",
    "Placer",
    "San Fernando",
    "San Jacinto",
    "San Pascual",
    "Uson",
  ],
};

const PROVINCES = Object.keys(BICOL_DATA);
// ─────────────────────────────────────────────────────────────────────────────

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
    address: "",
    school: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [isResumingVerification, setIsResumingVerification] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

  // Address state
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [muniQuery, setMuniQuery] = useState<string>("");
  const [showMuniDropdown, setShowMuniDropdown] = useState<boolean>(false);
  const muniRef = useRef<HTMLDivElement>(null);

  // ── All hooks before any early return ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (muniRef.current && !muniRef.current.contains(e.target as Node)) {
        setShowMuniDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const availableMunis: string[] = selectedProvince
    ? (BICOL_DATA[selectedProvince] ?? [])
    : [];

  const filteredMunis = availableMunis.filter((m) =>
    m.toLowerCase().includes(muniQuery.toLowerCase()),
  );
  // ─────────────────────────────────────────────────────────────────────────

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
    {
      value: "ACT - Multimedia & Animation",
      label: "Multimedia & Animation (ACT)",
    },
    { value: "ACT - Programming", label: "Programming (ACT)" },
    { value: "ACT - Networking", label: "Networking (ACT)" },
  ];

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
      console.error("Email check failed:", error);
    }
  };

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
      console.error("Name check failed:", error);
    }
  };

  const validatePasswordMatch = (password: string, confirm: string) => {
    if (password && confirm && password !== confirm) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }
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
      setIsResumingVerification(!!response.data.pendingVerification);
      setMessage({ type: "success", text: response.data.message });
      setStep("verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Signup failed";
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
        setMessage({ type: "error", text: errorMessage });
      } else {
        setMessage({ type: "error", text: "An unexpected error occurred." });
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
      try {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        const userData = loginResponse.data.user;
        const token = loginResponse.data.token;
        if (token) localStorage.setItem("token", token);
        login(userData, token);
        setCurrentUser({
          _id: userData._id || userData.id,
          name: userData.fullName || userData.name,
          email: userData.email,
          preferredCourse: userData.preferredCourse,
        });
        setTimeout(() => navigate("/welcome"), 1500);
      } catch (loginError) {
        console.error("❌ Auto-login failed:", loginError);
        setTimeout(() => onSwitchToLogin(), 2000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Verification failed",
        });
      } else {
        setMessage({ type: "error", text: "Verification failed" });
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
        setMessage({ type: "error", text: "Failed to resend code" });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Verification Step ─────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC2326]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -left-40 w-80 h-80 bg-[#2B3176]/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#2B3176] to-[#1C6CB3] p-8 text-center">
              <div className="flex justify-center mb-4">
                <img src={LOGO_Alt} alt="CCDI Logo" className="h-16 w-auto" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-white/80 text-sm">
                We sent a 6-digit code to{" "}
                <strong className="text-white">{formData.email}</strong>
              </p>
              {isResumingVerification && (
                <div className="mt-3 p-3 bg-yellow-50/10 border border-yellow-200/20 rounded-lg">
                  <p className="text-xs text-yellow-200">
                    ⚠️ This email was previously registered but not verified. A
                    fresh code has been sent.
                  </p>
                </div>
              )}
            </div>
            <div className="p-8">
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                    message.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-2">
                    <Mail size={14} className="text-[#2B3176]" />
                    Verification Code
                  </label>
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6CB3] text-center text-2xl tracking-widest font-bold text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="w-full py-2 text-[#1C6CB3] font-medium text-sm hover:text-[#2B3176] transition-colors"
                >
                  Resend Code
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Signup Step ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC2326]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-[#2B3176]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#A41D31]/5 to-[#1C6CB3]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex flex-col w-5/12 p-8 bg-gradient-to-br from-[#2B3176] via-[#1C6CB3] to-[#2B3176] text-white">
              {/* Logo & Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EC2326] to-[#A41D31] rounded-xl blur-md opacity-60"></div>
                    <img
                      src={LOGO_Alt}
                      alt="CCDI Logo"
                      className="relative h-12 w-auto"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                      <Sparkles size={12} />
                      <span className="text-xs font-semibold">
                        AI-POWERED PLATFORM
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      CCDI Career Assessment Test
                    </h1>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Start your journey with CCDI Sorsogon's intelligent career
                  guidance system powered by AI.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {[
                  {
                    icon: <GraduationCap size={18} />,
                    title: "Smart Program Matching",
                    desc: "Aligns your profile with CCDI's academic programs",
                  },
                  {
                    icon: <Brain size={18} />,
                    title: "AI-Powered Insights",
                    desc: "Advanced career recommendations tailored for you",
                  },
                  {
                    icon: <Target size={18} />,
                    title: "Career Readiness",
                    desc: "Data-backed guidance for your future career",
                  },
                  {
                    icon: <Star size={18} />,
                    title: "Personalized Path",
                    desc: "Tailored to your unique interests and strengths",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-[#EC2326]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gradient-to-br from-[#EC2326] to-[#A41D31] rounded-lg flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">{feature.title}</h5>
                        <p className="text-white/60 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy notice */}
              <div className="mt-auto">
                <div className="bg-gradient-to-r from-[#A41D31]/20 to-[#EC2326]/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                      <Shield size={16} />
                    </div>
                    <h4 className="font-bold text-sm">Your Privacy Matters</h4>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Your data is protected with enterprise-grade security and
                    used exclusively for academic guidance at CCDI Sorsogon.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
              <div className="w-full max-w-md">
                {/* Logo for mobile */}
                <div className="lg:hidden flex justify-center mb-6">
                  <img src={LOGO_Alt} alt="CCDI Logo" className="h-14 w-auto" />
                </div>

                {/* Form header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#2B3176] mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Begin your career assessment journey
                  </p>
                </div>

                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                      message.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span className="font-medium">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <User size={14} className="text-[#2B3176]" />
                      Full Name
                    </label>
                    <div
                      className={`relative rounded-lg transition-all duration-200 ${isFocused.fullName ? "ring-2 ring-[#1C6CB3] ring-offset-2" : ""}`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          });
                          setNameError("");
                        }}
                        onBlur={(e) => {
                          checkNameAvailability(e.target.value);
                          handleBlur("fullName");
                        }}
                        onFocus={() => handleFocus("fullName")}
                        required
                        className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200 ${nameError ? "border-red-300" : "border-gray-200"}`}
                      />
                    </div>
                    {nameError && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {nameError}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Mail size={14} className="text-[#2B3176]" />
                      Email Address
                    </label>
                    <div
                      className={`relative rounded-lg transition-all duration-200 ${isFocused.email ? "ring-2 ring-[#1C6CB3] ring-offset-2" : ""}`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setEmailError("");
                        }}
                        onBlur={(e) => {
                          checkEmailAvailability(e.target.value);
                          handleBlur("email");
                        }}
                        onFocus={() => handleFocus("email")}
                        required
                        className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200 ${emailError ? "border-red-300" : "border-gray-200"}`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Lock size={14} className="text-[#2B3176]" />
                      Password
                    </label>
                    <div
                      className={`relative rounded-lg transition-all duration-200 ${isFocused.password ? "ring-2 ring-[#1C6CB3] ring-offset-2" : ""}`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min. 6 characters)"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                          validatePasswordMatch(
                            e.target.value,
                            confirmPassword,
                          );
                        }}
                        onFocus={() => handleFocus("password")}
                        onBlur={() => handleBlur("password")}
                        minLength={6}
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                          />
                        ) : (
                          <Eye
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Lock size={14} className="text-[#2B3176]" />
                      Confirm Password
                    </label>
                    <div
                      className={`relative rounded-lg transition-all duration-200 ${isFocused.confirmPassword ? "ring-2 ring-[#1C6CB3] ring-offset-2" : ""}`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validatePasswordMatch(
                            formData.password,
                            e.target.value,
                          );
                        }}
                        onFocus={() => handleFocus("confirmPassword")}
                        onBlur={() => handleBlur("confirmPassword")}
                        required
                        className={`w-full pl-9 pr-10 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white text-gray-900 text-sm transition-all duration-200 ${passwordError ? "border-red-300" : "border-gray-200"}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                          />
                        ) : (
                          <Eye
                            size={16}
                            className="text-gray-400 hover:text-gray-600"
                          />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Preferred Course */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Book size={14} className="text-[#2B3176]" />
                      Preferred Course
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Book size={16} className="text-gray-400" />
                      </div>
                      <select
                        value={formData.preferredCourse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredCourse: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6CB3] focus:bg-white text-gray-900 text-sm transition-all duration-200 appearance-none bg-no-repeat bg-[length:12px] bg-[position:right_16px_center]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                        }}
                      >
                        {courses.map((course) => (
                          <option key={course.value} value={course.value}>
                            {course.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address - Province */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <MapPin size={14} className="text-[#2B3176]" />
                      Province
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-gray-400" />
                      </div>
                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          setMuniQuery("");
                          setFormData({ ...formData, address: "" });
                        }}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6CB3] focus:bg-white text-gray-900 text-sm transition-all duration-200 appearance-none bg-no-repeat bg-[length:12px] bg-[position:right_16px_center]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <option value="">Select Province</option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address - Municipality */}
                  {/* Address - Municipality */}
                  {selectedProvince && (
                    <div className="space-y-1" ref={muniRef}>
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <MapPin size={14} className="text-[#2B3176]" />
                        Municipality/City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder={`Search in ${selectedProvince}...`}
                          value={muniQuery}
                          onChange={(e) => {
                            setMuniQuery(e.target.value);
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            });
                            setShowMuniDropdown(true);
                          }}
                          onFocus={() => setShowMuniDropdown(true)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6CB3] focus:bg-white text-gray-900 text-sm transition-all duration-200"
                          autoComplete="off"
                        />
                        {showMuniDropdown && filteredMunis.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {filteredMunis.map((m) => (
                              <div
                                key={m}
                                onMouseDown={() => {
                                  setMuniQuery(m);
                                  setFormData({
                                    ...formData,
                                    address: `${m}, ${selectedProvince}`,
                                  });
                                  setShowMuniDropdown(false);
                                }}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                        )}
                        {showMuniDropdown &&
                          muniQuery &&
                          filteredMunis.length === 0 && (
                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                              <p className="text-xs text-gray-400 text-center">
                                No municipalities found
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* School */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <GraduationCap size={14} className="text-[#2B3176]" />
                      School
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Last / Current School Attended"
                        value={formData.school}
                        onChange={(e) =>
                          setFormData({ ...formData, school: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6CB3] focus:bg-white text-gray-900 text-sm transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreeToTerms: e.target.checked,
                        })
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#A41D31] focus:ring-[#A41D31]"
                      required
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-xs text-gray-600 leading-relaxed"
                    >
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTerms(true);
                        }}
                        className="text-[#1C6CB3] hover:underline font-medium"
                      >
                        Terms and Conditions
                      </button>
                      {" and "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPrivacy(true);
                        }}
                        className="text-[#1C6CB3] hover:underline font-medium"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      loading || !!emailError || !!nameError || !!passwordError
                    }
                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Sign In Link */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Already have an account?
                    </p>
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="inline-flex items-center gap-1 text-[#1C6CB3] font-semibold text-sm hover:text-[#2B3176] transition-colors group"
                    >
                      <span>Sign In Here!</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </form>

                {/* Mobile privacy notice */}
                <div className="lg:hidden mt-4 p-3 bg-gradient-to-r from-[#A41D31]/5 to-[#EC2326]/5 rounded-lg border border-[#EC2326]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-[#A41D31]" />
                    <span className="text-xs font-semibold text-gray-800">
                      Protected & Private
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Your data is encrypted and used exclusively for academic
                    guidance at CCDI Sorsogon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-bold text-[#2B3176]">
                  Terms and Conditions
                </h5>
                <button
                  type="button"
                  onClick={() => setShowTerms(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Last Updated:</strong> January 2026
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                1. Acceptance of Terms
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                By signing up, you agree to these Terms and our Privacy Policy.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                2. Eligibility
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                Limited to students and prospective students of CCDI Sorsogon.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                3. Account Responsibility
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                You are responsible for your account security.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                4. Service Use
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                Our career assessments are guidance tools — not binding advice.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                5. Limitation of Liability
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                We are not liable for indirect damages.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                6. Governing Law
              </h6>
              <p className="text-sm text-gray-600">
                Governed by the laws of the Republic of the Philippines.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-bold text-[#2B3176]">
                  Privacy Policy
                </h5>
                <button
                  type="button"
                  onClick={() => setShowPrivacy(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Last Updated:</strong> January 2026
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                1. Information We Collect
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                Full name, email, password (hashed), and preferred course.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                2. How We Use Your Data
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                To create your account, verify email, and personalize guidance.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                3. Data Sharing
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                We do not sell your data.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">
                4. Your Rights (RA 10173)
              </h6>
              <p className="text-sm text-gray-600 mb-4">
                You may access, correct, or delete your data.
              </p>
              <h6 className="font-semibold text-gray-800 mb-2">5. Security</h6>
              <p className="text-sm text-gray-600">
                Passwords are securely hashed. All data transmitted via HTTPS.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
