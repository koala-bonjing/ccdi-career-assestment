// src/pages/ResetPassword/ResetPassword.tsx
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Mail,
} from "lucide-react";

interface ErrorResponse {
  message?: string;
}

interface SuccessResponse {
  message: string;
}

type MessageType = {
  type: "success" | "error";
  text: string;
};

const ResetPassword: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email from URL params (sent from login page)
  const emailFromUrl = searchParams.get('email') || '';

  // Step 1: Enter email (skip if email provided)
  // Step 2: Enter verification code
  // Step 3: Enter new password
  const [step, setStep] = useState<1 | 2 | 3>(emailFromUrl ? 2 : 1);

  const [email, setEmail] = useState(emailFromUrl);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Request reset code
  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/api/auth/forgot-password`, { email });
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => setStep(2), 1500);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setMessage({
        type: "error",
        text: axiosError.response?.data?.message || "Failed to send reset code",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/api/auth/verify-reset-code`, {
        email,
        code: resetCode,
      });
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => setStep(3), 1500);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setMessage({
        type: "error",
        text: axiosError.response?.data?.message || "Invalid reset code",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/api/auth/reset-password`, {
        email,
        code: resetCode,
        newPassword,
      });
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setMessage({
        type: "error",
        text: axiosError.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend reset code
  const handleResendCode = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post<SuccessResponse>(`${BASE_URL}/api/auth/resend-reset-code`, { email });
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setMessage({
        type: "error",
        text: axiosError.response?.data?.message || "Failed to resend code",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EC2326]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-[#2B3176]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#A41D31] to-[#EC2326] p-6 text-center rounded-t-2xl">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
              <KeyRound size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {step === 1 && "Reset Your Password"}
              {step === 2 && "Verify Reset Code"}
              {step === 3 && "Create New Password"}
            </h2>
            <p className="text-white/80 text-sm">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Choose a strong new password"}
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6 bg-white rounded-b-2xl shadow-xl border border-gray-100">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= i
                        ? "bg-gradient-to-r from-[#A41D31] to-[#EC2326] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`w-12 h-1 ${step > i ? "bg-[#EC2326]" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Status Message */}
            {message && (
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

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Mail size={16} className="text-[#2B3176]" />
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC2326] focus:bg-white text-gray-900"
                      placeholder="Enter your registered email"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send a 6-digit code to this email address
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 disabled:opacity-50"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Code</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-2 text-[#1C6CB3] font-medium text-sm hover:text-[#2B3176] transition-colors"
                >
                  ← Back to Login
                </button>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <ShieldCheck size={16} className="text-[#2B3176]" />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC2326] focus:bg-white text-gray-900 text-center text-2xl font-bold tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || resetCode.length !== 6}
                  className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 disabled:opacity-50"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="w-full py-2 text-[#1C6CB3] font-medium text-sm hover:text-[#2B3176] transition-colors disabled:opacity-50"
                >
                  Didn't receive code? Resend
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Lock size={16} className="text-[#2B3176]" />
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC2326] focus:bg-white text-gray-900"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Lock size={16} className="text-[#2B3176]" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC2326] focus:bg-white text-gray-900"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#A41D31] to-[#EC2326] py-3 px-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#EC2326]/30 disabled:opacity-50"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;