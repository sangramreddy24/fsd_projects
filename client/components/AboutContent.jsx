import Skills from "./Skills";
import "./AboutContent.css";

// Middle link in the prop-drilling chain. About.jsx owns the full `profile`
// object and hands the whole thing down here. This component uses most of
// it directly, then drills just the `skills` slice one level further down
// into <Skills />, which never sees the rest of the profile at all.
export default function AboutContent({ profile }) {
  const { bio, facts } = profile;

  return (
    <>
      <div className="about-grid">
        <div className="about-text">
          {bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <dl className="about-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Skills skills={profile.skills} />
    </>
  );
}
