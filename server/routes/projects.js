// routes/projects.js
// Handles all /api/projects routes.

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Load projects from the JSON file once at startup.
// Keeping them in memory avoids reading the file on every request
// while still allowing the seed data to live in a plain JSON file.
const projectsFilePath = path.join(__dirname, "..", "data", "projects.json");
const projects = JSON.parse(fs.readFileSync(projectsFilePath, "utf-8"));

// GET /api/projects
// Returns the full list of projects as a JSON array.
router.get("/", (req, res) => {
  res.status(200).json(projects);
});

// GET /api/projects/:id
// Returns a single project matched by its string id field.
// Returns 404 with a JSON error body if no match is found.
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    // Never return HTML for API errors -- always JSON.
    return res.status(404).json({ error: "Project not found" });
  }

  res.status(200).json(project);
});

module.exports = router;