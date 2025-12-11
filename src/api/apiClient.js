import { useAuth } from "../context/AuthContext.jsx";
export function useApi() {
  const { token } = useAuth();

  return async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) return console.error(`API error: ${response.status}`);
    return response.json();
  };
}
