const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let getToken = () => "";

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function setTokenGetter(tokenGetter) {
  getToken = tokenGetter;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = body?.error?.message || "Request failed";
    throw new ApiError(message, response.status, body?.error?.code, body?.error?.details);
  }

  return body;
}

export const api = {
  get(path) {
    return request(path, { method: "GET" });
  },
  post(path, body) {
    return request(path, { method: "POST", body: JSON.stringify(body) });
  },
  put(path, body) {
    return request(path, { method: "PUT", body: JSON.stringify(body) });
  },
  patch(path, body) {
    return request(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  delete(path) {
    return request(path, { method: "DELETE" });
  },
};
