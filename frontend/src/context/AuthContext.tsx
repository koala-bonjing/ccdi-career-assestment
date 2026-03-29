import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { StorageEncryptor } from "../components/ResultPage/utils/encryption";

export interface User {
  _id: string;
  name: string;
  email: string;
  fullName: string;
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
    const parsed = StorageEncryptor.getItem("user");

    if (parsed) {

      if ((parsed._id || parsed.id) && parsed.email) {
        const normalizedUser = {
          ...parsed,
          _id: parsed._id || parsed.id,
        };
        return { user: normalizedUser, loading: false };
      }
    }
  } catch (e) {
    console.error("❌ Failed to parse user:", e);
  }
  return { user: null, loading: false };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(() => getInitialAuthState());


  const login = (userData: User) => {
    try {
      console.log("🔑 Login attempt with data:", userData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!userData._id && !(userData as any).id) {
        console.error("❌ Cannot login: user data missing _id/id");
        throw new Error("Invalid user data: missing ID");
      }

      if (!userData.email) {
        console.error("❌ Cannot login: user data missing email");
        throw new Error("Invalid user data: missing email");
      }

      const normalizedUser = {
        ...userData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: userData._id || (userData as any).id,
      };

      StorageEncryptor.setItem("user", normalizedUser);
      setState({ user: normalizedUser, loading: false });
      console.log("✅ User logged in successfully:", normalizedUser._id);
    } catch (e) {
      console.error("❌ Login failed:", e);
      throw e;
    }
  };

  const logout = () => {
    console.log("👋 Logging out user:", state.user?._id);
    StorageEncryptor.removeItem("user");
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
