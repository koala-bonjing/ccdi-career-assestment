// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthComponent from "./components/Auth/AuthComponent/AuthComponent";
import NavigationBar from "./components/NavigationBarComponents/NavigationBar";
import { AuthProvider } from "./context/AuthContext";
import WelcomeScreenComponent from "../src/components/EvaluationForm/EvaluationForm";
import EvaluationForm from "./components/EvaluationForm/EvaluationForm"; // Your actual form component

const App = () => (
  <AuthProvider>
    <BrowserRouter basename="/ccdi-career-assessment-test">
      <NavigationBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomeScreenComponent />} />
        <Route
          path="/signup"
          element={<AuthComponent initialMode="signup" />}
        />
        <Route path="/login" element={<AuthComponent initialMode="login" />} />

        {/* Welcome screen - accessible but will handle its own logic */}
        <Route path="/welcome" element={<WelcomeScreenComponent />} />

        {/* Assessment test route */}
        <Route
          path="/ccdi-career-assessment-test"
          element={<EvaluationForm />}
        />

        {/* Redirect typo route */}
        <Route
          path="/ccdi-career-assestment-test"
          element={<Navigate to="/ccdi-career-assessment-test" replace />}
        />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
