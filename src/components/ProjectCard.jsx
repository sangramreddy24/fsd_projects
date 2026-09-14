import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

// Fully generic: every piece of content comes in via props. This component
// has no idea what "EchoChamber" or "NoteFlow" is — Projects.jsx decides
// that by mapping over src/data/projects.js and passing fields down.
export default function ProjectCard({ id, title, tagline, description, tech, image, link }) {
  // Local state scoped to this exact card instance. Expanding one card's
  // "view details" does not affect any sibling ProjectCard.
  const [showDetails, setShowDetails] = useState(false);

  return (
    <article className="project-card">
      <img className="project-thumb" src={image} alt={`${title} preview`} />

      <div className="project-card-body">
        <h3>{title}</h3>
        <p className="project-tagline">{tagline}</p>
        <p className="project-desc">{description}</p>

        <ul className="tag-list" aria-label="Technologies used">
          {tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <button
          type="button"
          className="btn btn-small btn-outline"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? "Hide details" : "View details"}
        </button>

        {showDetails && (
          <div className="project-extra">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                Open live demo ↗
              </a>
            ) : (
              <p className="project-extra-note">No live demo for this one — it's coursework, not a deployed app.</p>
            )}
            <Link to={`/projects/${id}`} className="project-detail-link">
              Full project page →
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
