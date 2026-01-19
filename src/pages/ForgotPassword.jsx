import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BASE_URL}/api-auth-djoser/users/reset_password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    setMessage("If an account exists for that email address, you’ll receive a reset link shortly. Check your inbox and junk folder.");
    } catch (err) {
      setMessage("Something went wrong sending the reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Forgot password</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      {message ? <p>{message}</p> : null}

    </div>
  );
}