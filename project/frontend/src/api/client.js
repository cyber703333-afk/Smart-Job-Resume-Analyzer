// Thin wrapper around fetch() that talks to the backend REST API.
// Change API_BASE via a .env file (VITE_API_BASE_URL) if your backend
// runs somewhere other than http://localhost:5000.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token, isFormData = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path, token) => request(path, { method: "GET", token }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  postForm: (path, formData, token) =>
    request(path, { method: "POST", body: formData, token, isFormData: true }),
};

export { API_BASE };
