import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ServerURL from "../data/config";

export default function Signup() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setError("");
    if (data.get("password") !== data.get("confirmation")) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await axios.post(`${ServerURL}/users/`, {
        first_name: data.get("first_name").trim(),
        last_name: data.get("last_name").trim(),
        email: data.get("email").trim(),
        password: data.get("password"),
      });
      setCreated(true);
    } catch (err) {
      const errors = err.response?.data;
      setError(errors && typeof errors === "object"
        ? Object.entries(errors).map(([field, messages]) =>
          `${field === "detail" ? "" : `${field.replaceAll("_", " ")}: `}${Array.isArray(messages) ? messages.join(" ") : messages}`
        ).join(" ")
        : "Unable to create your account. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="signup-page mx-auto py-4" style={{ maxWidth: 480 }}>
      <h1>Create an account</h1>
      {created ? (
        <div role="status">
          <p>Your account has been created. Check your email and click the activation link, then use Login above to sign in.</p>
          <Link to="/">Return to Home</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>Sign up to TradeZen. We’ll email you a link to activate your account.</p>
          {error && <p className="error-message" role="alert">{error}</p>}
          <fieldset disabled={pending}>
            <label className="d-block mb-3">First name
              <input className="form-control" name="first_name" autoComplete="given-name" maxLength={50} />
            </label>
            <label className="d-block mb-3">Last name
              <input className="form-control" name="last_name" autoComplete="family-name" maxLength={50} />
            </label>
            <label className="d-block mb-3">Email
              <input className="form-control" type="email" name="email" autoComplete="email" maxLength={100} required />
            </label>
            <label className="d-block mb-3">Password
              <input className="form-control" type="password" name="password" autoComplete="new-password" minLength={8} aria-describedby="password-help" required />
            </label>
            <p id="password-help">Use at least 8 characters. Avoid common passwords, personal details, or only numbers.</p>
            <label className="d-block mb-3">Confirm password
              <input className="form-control" type="password" name="confirmation" autoComplete="new-password" minLength={8} required />
            </label>
            <button className="btn btn-primary" type="submit">{pending ? "Creating account…" : "Sign up"}</button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
