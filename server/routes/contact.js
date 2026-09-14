// routes/contact.js
// Handles POST /api/contact (submit) and GET /api/contact (read submissions).

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// ---------- Storage ----------
// Path to the JSON file that persists submissions across server restarts.
const submissionsFilePath = path.join(
  __dirname,
  "..",
  "data",
  "submissions.json"
);

// In-memory array loaded from disk at startup.
// All writes go to both this array AND the file.
let submissions = [];

// Load existing submissions from the JSON file when the server starts.
try {
  const raw = fs.readFileSync(submissionsFilePath, "utf-8");
  submissions = JSON.parse(raw);
} catch (err) {
  console.error("Could not load submissions.json, starting with []:", err.message);
  submissions = [];
}

// Helper: write the in-memory array back to disk.
function persistSubmissions() {
  fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2), "utf-8");
}

// ---------- Validation helpers ----------

// Returns true if the string contains "@" and at least one "." after the "@".
function isValidEmail(email) {
  const atIndex = email.indexOf("@");
  if (atIndex < 1) return false;
  const domain = email.slice(atIndex + 1);
  return domain.includes(".");
}

// ---------- Routes ----------

// POST /api/contact
// Requires Content-Type: application/json and body with name, email, message.
// Guard against missing req.body (happens when Content-Type header is absent).
router.post("/", (req, res) => {
  // Safety guard: if the client forgot Content-Type: application/json,
  // express.json() will not parse the body and req.body will be undefined.
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: "Request body must be JSON. Set Content-Type: application/json.",
    });
  }

  const { name, email, message } = req.body;

  // --- Field presence checks ---
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || !String(email).trim()) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  // --- Email format check ---
  if (!isValidEmail(String(email).trim())) {
    return res.status(400).json({
      error: "Email must contain '@' and a valid domain (e.g. user@example.com)",
    });
  }

  // --- Build and store the record ---
  const record = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    submittedAt: new Date().toISOString(),
  };

  submissions.push(record);
  persistSubmissions();

  return res.status(201).json({
    message: "Thanks! Your message has been received.",
    submission: record,
  });
});

// GET /api/contact
// Returns all stored contact submissions as a JSON array.
// NOTE: This endpoint is intentionally unauthenticated for assignment purposes.
//       In a production system this would be protected by an admin auth layer.
router.get("/", (req, res) => {
  res.status(200).json(submissions);
});

module.exports = router;