// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthComponent from "./components/Auth/AuthComponent/AuthComponent";
import NavigationBar from "./components/NavigationBarComponents/NavigationBar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import WelcomeScreenComponent from "./components/WelcomeScreen/WelcomePage"; // Fixed import path
import EvaluationForm from "./components/EvaluationForm/EvaluationForm";
import { Container } from "react-bootstrap"; // Fixed import - use react-bootstrap instead of lucide-react
import { Spinner } from "react-bootstrap";
import ResultsPage from "./components/ResultPage/result-page";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading...</span>
      </Container>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to welcome if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading...</span>
      </Container>
    );
  }

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/welcome" replace />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - redirect to welcome if already authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthComponent initialMode="login" />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthComponent initialMode="signup" />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/welcome" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomeScreenComponent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <EvaluationForm />
          </ProtectedRoute>
        }
      />

      {/* Redirect old assessment route to new one */}
      <Route
        path="/ccdi-career-assessment-test"
        element={<Navigate to="/assessment" replace />}
      />
      <Route
        path="/ccdi-career-assestment-test"
        element={<Navigate to="/assessment" replace />}
      />

      {/* Catch-all for unmatched routes */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      {" "}
      {/* Remove basename or adjust as needed */}
      <NavigationBar />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
