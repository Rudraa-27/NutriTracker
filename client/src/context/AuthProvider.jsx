import {
  useEffect,
  useState
} from "react";

import { AuthContext } from "./AuthContext";

import {
  registerUser,
  loginUser,
  getCurrentUser
} from "../services/authService";

const TOKEN_KEY = "nutritrack_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        setUser(data.user);
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
    };

    window.addEventListener("nutritrack:logout", handleForcedLogout);

    return () => {
      window.removeEventListener("nutritrack:logout", handleForcedLogout);
    };
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};