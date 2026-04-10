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
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialAuthState = (): {
  user: User | null;
  token: string | null;
  loading: boolean;
} => {
  try {
    const parsed = StorageEncryptor.getItem("user");
    const token = StorageEncryptor.getItem("token") as string | null;

    if (parsed && token && (parsed._id || parsed.id) && parsed.email) {
      return {
        user: { ...parsed, _id: parsed._id || parsed.id },
        token,
        loading: false,
      };
    }
  } catch (e) {
    console.error("❌ Failed to restore auth state:", e);
  }
  return { user: null, token: null, loading: false };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(() => getInitialAuthState());

  const login = (userData: User, token: string) => {
    try {
      const id = userData._id || (userData as { _id?: string; id?: string }).id;

      if (!id) {
        console.error("❌ Received user data:", userData);
        throw new Error("Invalid user data: missing ID");
      }
      if (!userData.email) {
        throw new Error("Invalid user data: missing email");
      }
      if (!token) {
        throw new Error("Invalid auth: missing token");
      }

      const normalizedUser: User = {
        ...userData,
        _id: id,
      };

      StorageEncryptor.setItem("user", normalizedUser);
      StorageEncryptor.setItem("token", token);
      setState({ user: normalizedUser, token, loading: false });

      console.log("✅ User logged in:", normalizedUser._id);
    } catch (e) {
      console.error("❌ Login failed:", e);
      throw e;
    }
  };

  const logout = () => {
    StorageEncryptor.removeItem("user");
    StorageEncryptor.removeItem("token");
    setState({ user: null, token: null, loading: false });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        login,
        logout,
        isAuthenticated: !!state.user && !!state.token,
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
