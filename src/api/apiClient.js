import { useAuth } from "../context/AuthContext.jsx";
export function useApi() {
  const { token } = useAuth();
  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "API error");
    }

    return res.json();
  };
}
