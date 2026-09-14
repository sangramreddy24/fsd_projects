import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjectById } from "../api/client";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  // Dynamic route param: /projects/:projectId
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);   // non-404 fetch error
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Re-run whenever the URL param changes (handles client-side navigation
    // between project detail pages AND hard refreshes / direct deep links).
    let cancelled = false;

    // Reset state before each fetch so stale data from a previous project
    // doesn't flash on screen during the new request.
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setProject(null);

    fetchProjectById(projectId)
      .then((data) => {
        if (cancelled) return;
        if (data === null) {
          // fetchProjectById returns null for a 404 from the API
          setNotFound(true);
        } else {
          setProject(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("fetchProjectById error:", err);
        setError("Couldn't load this project. Is the backend running?");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]); // re-fetch when the id in the URL changes

  // --- Loading state ---
  if (isLoading) {
    return (
      <section className="project-detail">
        <div className="wrap">
          <p className="project-detail-status">Loading project…</p>
        </div>
      </section>
    );
  }

  // --- Network / server error state ---
  if (error) {
    return (
      <section className="project-detail">
        <div className="wrap">
          <p className="project-detail-error">{error}</p>
          <p>
            <Link to="/projects">← Back to all projects</Link>
          </p>
        </div>
      </section>
    );
  }

  // --- 404: project id does not exist in the backend ---
  if (notFound) {
    return (
      <section className="project-detail">
        <div className="wrap">
          <p className="section-eyebrow">Not found</p>
          <h2>No project matches "{projectId}"</h2>
          <p>
            <Link to="/projects">← Back to all projects</Link>
          </p>
        </div>
      </section>
    );
  }

  // --- Happy path: project data loaded ---
  return (
    <section className="project-detail">
      <div className="wrap">
        <p className="section-eyebrow">Project</p>
        <h2>{project.title}</h2>
        <p className="project-detail-tagline">{project.tagline}</p>

        <img
          className="project-detail-thumb"
          src={project.image}
          alt={`${project.title} preview`}
        />

        <p>{project.description}</p>
        <p>{project.details}</p>

        <ul className="tag-list" aria-label="Technologies used">
          {project.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="project-detail-links">
          {project.link && (
            <a
              className="btn btn-primary"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open live demo
            </a>
          )}
          <a
            className="btn btn-outline"
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
          <Link className="btn btn-outline" to="/projects">
            ← All projects
          </Link>
        </div>
      </div>
    </section>
  );
}