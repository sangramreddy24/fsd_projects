import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap">
        <p className="section-eyebrow">404</p>
        <h2>That page doesn't exist</h2>
        <p>The link might be broken, or the page may have moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
