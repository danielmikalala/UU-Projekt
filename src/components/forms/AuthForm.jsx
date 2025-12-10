import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const handleLoginChange = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field, value) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(loginForm);
      navigate("/home");
    } catch (error) {
      console.error("Login error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setIsSubmitting(true);
    try {
      await register(registerForm);
      navigate("/home");
    } catch (error) {
      console.error("Register error", error);
      setRegisterError(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">CrowdFund</h1>
        <p className="mt-1 text-sm text-gray-500 text-center">
          Login or create an account to get started
        </p>

        <div className="mt-6 flex rounded-md border border-gray-200 bg-gray-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 transition-colors ${
              isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md px-3 py-2 transition-colors ${
              !isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => handleLoginChange("email", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => handleLoginChange("password", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <PrimaryButton
              type="submit"
              className="mt-4 w-full !bg-purple-600 !border-purple-600 hover:!bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </PrimaryButton>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
            {registerError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                {registerError}
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => handleRegisterChange("name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => handleRegisterChange("email", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={registerForm.password}
                onChange={(e) => handleRegisterChange("password", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <PrimaryButton
              type="submit"
              className="mt-4 w-full !bg-purple-600 !border-purple-600 hover:!bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  );
}
