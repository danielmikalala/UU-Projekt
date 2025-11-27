import { createContext, useContext, useEffect, useState } from "react";
import { loginBasic, registerBasic } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
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
      name: name || data.name || (email ? email.split("@")[0] : "User"),
      role: data.role,
    };

    setToken(data.token);
    setUser(userObj);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(userObj));

    return { user: userObj, token: data.token };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
