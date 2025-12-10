import { createContext, useContext, useEffect, useState } from "react";
import { loginBasic, registerBasic } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginBasic({ email, password });

    const userObj = {
      email: data.email ?? email,
      role: data.role,
    };

    setToken(data.token);
    setUser(userObj);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(userObj));

    return { user: userObj, token: data.token };
  };

  const register = async ({ name, email, password }) => {
    const data = await registerBasic({ name, email, password });

    const userObj = {
      email: data.email ?? email,
      name: data.name || data.email?.split("@")[0] || "User",
      role: data.role,
    };

    setToken(data.token);
    setUser(userObj);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(userObj));

    return { user: userObj, token: data.token };
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
