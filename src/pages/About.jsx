import AboutContent from "../components/AboutContent";

const profile = {
  bio: [
    "I'm an undergraduate in Computer Science and Engineering at the National Institute of Technology, Warangal, graduating in 2028. My interest in web development started with wanting to see my own ideas running in a browser, and it has since turned into a habit of building complete, usable applications rather than stopping at isolated exercises.",
    "This site itself is one of those projects: it started as static HTML and CSS for an earlier assignment, and is now a React app with routing, component state and a light/dark theme, built for my Full Stack Development coursework.",
  ],
  facts: [
    { label: "Institute", value: "NIT Warangal" },
    { label: "Programme", value: "B.Tech, Computer Science & Engineering" },
    { label: "Graduating", value: "2028" },
    { label: "Focus areas", value: "Full stack web development, DBMS, compilers" },
  ],
  skills: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Git",
    "C",
    "Python",
  ],
};

export default function About() {
  return (
    <section className="about">
      <div className="wrap">
        <p className="section-eyebrow">01 — About</p>
        <h2>A bit about me</h2>

        {/* `profile` is owned here and drilled down: About -> AboutContent -> Skills */}
        <AboutContent profile={profile} />
      </div>
    </section>
  );
}
