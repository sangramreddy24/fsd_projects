import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { fetchProjects } from "../api/client";
import "./Projects.css";

export default function Projects() {
  // Track the fetched list, a loading flag, and any error string.
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the project list from the backend on mount.
    // The static src/data/projects.js import is no longer used here.
    let cancelled = false; // guard against state updates on unmounted component

    fetchProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("fetchProjects error:", err);
          setError("Couldn't load projects. Is the backend running?");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []); // empty dep array: run once on mount

  return (
    <section className="projects">
      <div className="wrap">
        <p className="section-eyebrow">02 — Projects</p>
        <h2>Things I've built</h2>

        {/* Loading state */}
        {isLoading && <p className="projects-status">Loading projects…</p>}

        {/* Error state: visible in the UI, not just the console */}
        {error && <p className="projects-error">{error}</p>}

        {/* Project grid: only rendered when data is ready */}
        {!isLoading && !error && (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                tagline={project.tagline}
                description={project.description}
                tech={project.tech}
                image={project.image}
                link={project.link}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}