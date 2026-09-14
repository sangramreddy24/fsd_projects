// server.js  -- Entry point for the portfolio backend (Assignment 2)
//
// Architecture overview:
//  - Express handles HTTP routing.
//  - cors allows requests from the React frontend (origin read from .env).
//  - dotenv loads PORT and CLIENT_ORIGIN from .env.
//  - No database -- projects live in /data/projects.json (read once at
//    startup); contact submissions live in /data/submissions.json
//    (read at startup, written on every POST /api/contact).
//
// Run:  npm start           (production)
//       npm run dev         (development, auto-restart via nodemon)

"use strict";

// Load environment variables from .env BEFORE any other require that
// might read process.env.  dotenv does nothing if the variable is already
// set in the environment, so this is safe in CI/production too.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// ---------- Route modules ----------
const projectsRouter = require("./routes/projects");
const contactRouter = require("./routes/contact");

// ---------- Middleware ----------
const errorHandler = require("./middleware/errorHandler");

// ---------- App setup ----------
const app = express();

// Read the allowed frontend origin from the environment.
// CLIENT_ORIGIN must be set in .env -- see .env.example.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200, // Some older browsers choke on 204
  })
);

// Parse incoming JSON request bodies (needed for POST /api/contact).
app.use(express.json());

// ---------- Routes ----------

// Health-check root route -- quick smoke test to confirm the server is up.
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Mount the projects and contact routers under /api.
app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);

// ---------- 404 handler ----------
// Must come AFTER all real routes so it only fires for unmatched paths.
// Returns JSON, never HTML, so API clients always get a parseable error.
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} -- route not found`,
  });
});

// ---------- Global error handler ----------
// Must be registered LAST and must accept exactly 4 arguments.
// Catches anything passed to next(err) or thrown in async code.
app.use(errorHandler);

// ---------- Start ----------
// PORT is read from .env -- never hardcoded.
const PORT = process.env.PORT;
if (!PORT) {
  console.error("ERROR: PORT is not set. Add PORT=5000 to your .env file.");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
  console.log("Allowed CORS origin: " + (CLIENT_ORIGIN || "(none set)"));
});