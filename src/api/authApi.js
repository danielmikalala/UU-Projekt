// src/api/authApi.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost";

async function handleResponse(resp) {
  if (!resp.ok) {
    let message = `Request failed with status ${resp.status}`;
    try {
      const data = await resp.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return resp.json();
}

export async function loginBasic({ email, password }) {
  email = email.toLowerCase();  
  const resp = await fetch(`${API_BASE_URL}/authentication/login-basic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(resp);
}

export async function registerBasic({ name, email, password }) {
  email = email.toLowerCase();  
  const createResp = await fetch(`${API_BASE_URL}/users/create-basic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  await handleResponse(createResp);

  return loginBasic({ email, password });
}
