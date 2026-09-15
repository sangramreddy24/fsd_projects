// src/api/client.js
// Single source of truth for the backend base URL.
//
// Vite exposes env variables that start with VITE_ to client-side code.
// Set VITE_API_URL in the .env file at the portfolio-react project root.
// Example: VITE_API_URL=http://localhost:5000
//
// Never hardcode http://localhost:PORT directly in components -- import
// the helpers from this file instead so the URL is changed in one place.

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.warn(
    "[api/client] VITE_API_URL is not set. " +
      "Add VITE_API_URL=http://localhost:5000 to your .env file."
  );
}

// ---------- Projects ----------

/**
 * Fetch all projects from GET /api/projects.
 * Throws an Error if the network request fails or the server returns non-2xx.
 * @returns {Promise<Array>}
 */
export async function fetchProjects() {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a single project by id from GET /api/projects/:id.
 * Returns the project object on success.
 * Returns null when the server responds with 404 (project not found).
 * Throws an Error for any other non-2xx response or network failure.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchProjectById(id) {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }
  return res.json();
}

// ---------- Contact ----------

/**
 * POST { name, email, message } to /api/contact.
 * Returns the parsed response body on success (201).
 * On a 400 response, throws an Error whose message is the server error string.
 * On a network failure, throws a generic Error.
 * @param {{ name: string, email: string, message: string }} payload
 * @returns {Promise<Object>}
 */
export async function submitContact(payload) {
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    // Surface the field-specific server error message (e.g. "Email is required")
    throw new Error(data.error || `Server responded with ${res.status}`);
  }

  return data;
}