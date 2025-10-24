// src/components/Auth/LoginForm/LoginForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { BASE_URL } from "../../../config/constants";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      setMessage({ type: "success", text: response.data.message });

      navigate("/welcome");

      // Call the success handler which will update auth context and navigate
      onLoginSuccess(response.data.user);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-2">Welcome Back</h2>
          <p className="text-muted text-center mb-4">
            Sign in to continue your assessment
          </p>

          {message.text && (
            <div
              className={`alert d-flex align-items-center ${
                message.type === "success" ? "alert-success" : "alert-danger"
              } mb-3`}
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
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 mb-3"
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
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="btn btn-link p-0 ms-1"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
