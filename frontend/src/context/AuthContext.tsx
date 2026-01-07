import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  fullName?: string;
  preferredCourse?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialAuthState = (): { user: User | null; loading: boolean } => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Optional: validate shape
      if (parsed && parsed.id && parsed.email) {
        return { user: parsed, loading: false };
      }
    }
  } catch (e) {
    console.warn("Failed to parse user from localStorage", e);
  }
  return { user: null, loading: false };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(() => getInitialAuthState());

  const login = (userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setState({ user: userData, loading: false });
    } catch (e) {
      console.error("Failed to save user", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        isAuthenticated: !!state.user,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
