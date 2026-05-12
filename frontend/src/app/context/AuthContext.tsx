import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useNavigate } from "react-router";
import { getMe } from "../utils/api";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (provider: "google" | "github") => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const BASE_API = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // No token
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const me = await getMe();

        if (me) {
          setUser(me);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error(
          "Failed to fetch authenticated user",
          error,
        );

        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    provider: "google" | "github",
  ) => {
    setIsLoading(true);

    const url = `${BASE_API}/oauth2/authorization/${provider}`;

    window.location.href = url;
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("token");

    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}