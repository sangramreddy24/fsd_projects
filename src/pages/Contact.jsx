import ContactForm from "../components/ContactForm";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact">
      <div className="wrap contact-inner">
        <div className="contact-intro">
          <p className="section-eyebrow">03 — Contact</p>
          <h2>Let's talk</h2>
          <p>
            Open to internships, collaborations on projects, or just a chat
            about full stack development. The fastest way to reach me is
            email.
          </p>
          <address>
            <a href="mailto:sangramyedipala@gmail.com">sangramyedipala@gmail.com</a>
            <br />
            <a href="https://github.com/sangramreddy24" target="_blank" rel="noopener noreferrer">
              github.com/sangramreddy24
            </a>
          </address>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
