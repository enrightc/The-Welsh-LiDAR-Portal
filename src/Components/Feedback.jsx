import { useState } from "react";
import LidarFooter from "../Components/LidarFooter";

export default function Feedback() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/manpnrbq", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("✅ Thanks! Your feedback was sent.");
        form.reset();
      } else {
        setStatus("❌ Sorry, something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem"}}>
      
        <h1>Send Feedback</h1>

        <p>We’d love your feedback — let us know about any bugs you spot, features you’d like to see, or anything you think could be improved.</p>

        <label style={{ display: "block", marginBottom: 8 }}>
          Your name (optional)
          <input type="name" name="name" placeholder="Your name"
                style={{ width: "100%", padding: "0.5rem", marginTop: 4 }} />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Your email (optional)
          <input type="email" name="email" placeholder="you@example.com"
                style={{ width: "100%", padding: "0.5rem", marginTop: 4 }} />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Message
          <textarea name="message" required rows={5} placeholder="Your feedback..."
                    style={{ width: "100%", padding: "0.5rem", marginTop: 4 }} />
        </label>

        {/* Subject line for Formspree emails */}
        <input type="hidden" name="_subject" value="New Welsh LiDAR Portal feedback" />

        {/* Honeypot (hidden field to catch bots) */}
        <input type="text" name="website" tabIndex="-1" autoComplete="off"
              aria-hidden="true" style={{ display: "none" }} />

        <button type="submit" disabled={loading}
                style={{ padding: "0.6rem 1rem", cursor: "pointer" }}>
          {loading ? "Sending..." : "Send feedback"}
        </button>

        <small style={{ display: "block",       color: "#666", marginTop: "1rem" }}>
          If you’re reporting a bug, please describe what you were doing when it occurred and the steps we can follow to reproduce it. This will help us investigate and fix the issue more quickly.
        </small>

        {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
      </form>

      <LidarFooter />
    </>
    
  );
}