import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
    console.log("🔍 Checking localStorage for user:", savedUser);
    
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      console.log("📦 Parsed user data:", parsed);
      
      // Check for _id (MongoDB style) or id
      if (parsed && (parsed._id || parsed.id) && parsed.email) {
        // Normalize to always use _id
        const normalizedUser = {
          ...parsed,
          _id: parsed._id || parsed.id,
        };
        console.log("✅ User restored from localStorage:", normalizedUser._id);
        return { user: normalizedUser, loading: false };
      } else {
        console.warn("⚠️ Invalid user data in localStorage:", parsed);
      }
    }
  } catch (e) {
    console.error("❌ Failed to parse user from localStorage:", e);
  }
  
  console.log("ℹ️ No valid user in localStorage");
  return { user: null, loading: false };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(() => getInitialAuthState());

  // Debug: Log auth state changes
  useEffect(() => {
    console.log("🔐 Auth state changed:", {
      isAuthenticated: !!state.user,
      userId: state.user?._id,
      userEmail: state.user?.email,
    });
  }, [state.user]);

  const login = (userData: User) => {
    try {
      console.log("🔑 Login attempt with data:", userData);
      
      // Validate required fields
      if (!userData._id && !userData._id) {
        console.error("❌ Cannot login: user data missing _id/id");
        throw new Error("Invalid user data: missing ID");
      }
      
      if (!userData.email) {
        console.error("❌ Cannot login: user data missing email");
        throw new Error("Invalid user data: missing email");
      }
      
      // Normalize user data
      const normalizedUser = {
        ...userData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: userData._id || (userData as any).id,
      };
      
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setState({ user: normalizedUser, loading: false });
      console.log("✅ User logged in successfully:", normalizedUser._id);
    } catch (e) {
      console.error("❌ Login failed:", e);
      throw e;
    }
  };

  const logout = () => {
    console.log("👋 Logging out user:", state.user?._id);
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