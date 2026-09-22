import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ServerURL from "../data/config";

export default function PasswordReset() {
  const { uid, token } = useParams();
  const [search] = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const confirming = Boolean(uid && token);

  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setError("");
    if (confirming && data.get("password1") !== data.get("password2")) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      const path = confirming
        ? `/users/password-reset-confirm/${encodeURIComponent(uid)}/${encodeURIComponent(token)}/`
        : "/users/password-reset/";
      const body = confirming
        ? { password1: data.get("password1"), password2: data.get("password2") }
        : { email: data.get("email").trim() };
      const response = await axios.post(`${ServerURL}${path}`, body);
      setMessage(response.data.message);
    } catch (err) {
      const body = err.response?.data;
      setError(body && typeof body === "object"
        ? Object.values(body).flat().join(" ")
        : "Unable to reset your password. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto py-4" style={{ maxWidth: 480 }}>
      <h1>{confirming ? "Choose a new password" : "Reset your password"}</h1>
      {message ? (
        <div role="status">
          <p>{message}</p>
          {confirming
            ? <p>Use Login above to sign in.</p>
            : <p>Check your inbox and spam folder, then open the link in the email.</p>}
        </div>
      ) : (
        <form onSubmit={submit}>
          {error && <p className="error-message" role="alert">{error}</p>}
          <fieldset disabled={pending}>
            {confirming ? (
              <>
                <label className="d-block mb-3">New password
                  <input className="form-control" type="password" name="password1" autoComplete="new-password" minLength={8} required />
                </label>
                <p>Use at least 8 characters. Avoid common passwords, personal details, or only numbers.</p>
                <label className="d-block mb-3">Confirm new password
                  <input className="form-control" type="password" name="password2" autoComplete="new-password" minLength={8} required />
                </label>
              </>
            ) : (
              <label className="d-block mb-3">Email
                <input className="form-control" type="email" name="email" defaultValue={search.get("email") || ""} autoComplete="email" required />
              </label>
            )}
            <button className="btn btn-primary" type="submit">
              {pending ? "Please wait…" : confirming ? "Update password" : "Send reset link"}
            </button>
          </fieldset>
        </form>
      )}
      {confirming && <Link className="d-block mt-3" to="/forgot-password">Request a new reset link</Link>}
    </section>
  );
}
