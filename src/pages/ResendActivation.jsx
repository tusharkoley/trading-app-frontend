import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ServerURL from "../data/config";

export default function ResendActivation() {
  const [search] = useSearchParams();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const email = new FormData(event.currentTarget).get("email").trim();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post(`${ServerURL}/users/resend-activation/`, { email });
      setMessage(response.data.message);
    } catch (err) {
      const body = err.response?.data;
      setError(body && typeof body === "object"
        ? Object.values(body).flat().join(" ")
        : "Unable to send the activation email. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto py-4" style={{ maxWidth: 480 }}>
      <h1>Activate your account</h1>
      <p>Request a fresh activation email, then open its link before logging in.</p>
      {message && <p role="status">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <fieldset disabled={pending}>
          <label className="d-block mb-3">Email
            <input className="form-control" type="email" name="email" defaultValue={search.get("email") || ""} autoComplete="email" required />
          </label>
          <button className="btn btn-primary" type="submit">
            {pending ? "Sending…" : "Resend activation email"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
