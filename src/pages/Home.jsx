import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  // Piece of state: whether the simulated initial load has finished.
  const [isLoading, setIsLoading] = useState(true);

  // useEffect #: runs once on mount ([] dependency array) to simulate a
  // brief loading sequence before showing the hero content. The timeout
  // is cleared on unmount so it never fires after the component is gone.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="home-loading">
        <div className="wrap">
          <div className="spinner" role="status" aria-live="polite">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="intro">
      <div className="wrap intro-inner">
        <p className="terminal-line" aria-hidden="true">
          <span className="terminal-prompt">sangram@nitw</span>
          <span className="terminal-punct">:~$</span>
          <span className="terminal-cmd"> whoami</span>
          <span className="cursor"></span>
        </p>

        <h1>Sangram Reddy</h1>
        <p className="intro-role">CSE Undergraduate &middot; NIT Warangal, Class of 2028</p>

        <p className="intro-summary">
          I build small, focused web applications and enjoy the layer where
          front-end interfaces meet back-end logic. This portfolio is itself
          a running example of that — now rebuilt in React with routing,
          state and a light/dark theme.
        </p>

        <div className="intro-actions">
          <Link className="btn btn-primary" to="/projects">
            View projects
          </Link>
          <Link className="btn btn-outline" to="/contact">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
