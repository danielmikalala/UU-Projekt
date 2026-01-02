import { useAuth } from "../context/AuthContext.jsx";

/**
 * USAGE: 
 * import { useApi } from "../api/apiClient";
 * const api = useApi();
 * GET example:
 * const campaigns = await api("/projects");
 * POST example:
 * await api("/projects", {
  method: "POST",
  body: {
    name: "Pomoc útulkům",
    goalAmount: 10000,
    category: "Zvířata",
  },
});
 */
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

    const body = options.body
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined;

    const response = await fetch(url, {
      ...options,
      body,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `API ${response.status}: `;
      try {
        const contentType = response.headers.get("content-type");
        const text = await response.text();
        if (contentType && contentType.includes("application/json") && text) {
          const errorData = JSON.parse(text);
          errorMessage +=
            errorData.error || errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage += text || "Unknown error";
        }
      } catch {
        errorMessage += "Failed to parse error response";
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (!text || text.trim() === "") {
      return null;
    }

    const text = await response.text();
return text ? JSON.parse(text) : null;
    if (contentType && contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };
}
