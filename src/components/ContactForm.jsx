import { useState } from "react";
import { submitContact } from "../api/client";
import "./ContactForm.css";

const EMPTY_FORM = { name: "", email: "", message: "" };

// Client-side validation runs on every keystroke as a first pass.
// The backend also validates; server errors are surfaced via serverError state.
function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "That doesn't look like a valid email.";
  }

  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  }

  return errors;
}

export default function ContactForm() {
  // Controlled form fields
  const [values, setValues] = useState(EMPTY_FORM);
  // Client-side validation errors (computed on every change)
  const [errors, setErrors] = useState({});
  // True while the POST request is in flight — disables the submit button
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Set to true on a 201 success so the confirmation message appears
  const [submitted, setSubmitted] = useState(false);
  // Field-specific or network error returned by the server (string | null)
  const [serverError, setServerError] = useState(null);

  const hasBeenTouched = Object.values(values).some((v) => v.trim() !== "");
  const currentErrors = validate(values);
  const isValid = Object.keys(currentErrors).length === 0 && hasBeenTouched;

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors(validate(nextValues));
    // Clear any previous server error when the user starts editing again
    if (serverError) setServerError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Run client-side validation one final time before submitting
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      // POST to /api/contact via the shared API helper.
      // submitContact throws with the server error message on 400,
      // and with a generic message on network failure.
      await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });

      // Success (201): show confirmation and reset the form
      setSubmitted(true);
      setValues(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      // Surface the exact server error string (e.g. "Email is required")
      // or a network-failure message in the UI
      setServerError(
        err.message || "Couldn't send your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={values.message}
          onChange={handleChange}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>

      {/* Server-side error: exact message from the API, or network failure text */}
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      {/* Success confirmation: shown after a 201 response */}
      {submitted && (
        <p className="form-success" role="status">
          Thanks — your message has been sent!
        </p>
      )}
    </form>
  );
}