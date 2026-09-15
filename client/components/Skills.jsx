import "./Skills.css";

// Grandchild in the prop-drilling chain: About -> AboutContent -> Skills.
// This component only ever sees the `skills` array it's handed — it has no
// knowledge of the rest of the profile data living up in About.jsx.
export default function Skills({ skills }) {
  return (
    <div className="skills-block">
      <h3 className="skills-heading">Currently working with</h3>
      <ul className="skills-list">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}
