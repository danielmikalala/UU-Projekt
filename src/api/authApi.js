async function handleResponse(resp) {
  if (!resp.ok) {
    let message = `Error ${resp.status}`;
    try {
      const data = await resp.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return resp.json();
}

export async function loginBasic({ email, password }) {
  email = email.toLowerCase();
  const resp = await fetch(`/authentication/login-basic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(resp);
}

export async function registerBasic({ name, email, password }) {
  email = email.toLowerCase();
  const resp = await fetch(`/users/create-basic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(resp);
}
