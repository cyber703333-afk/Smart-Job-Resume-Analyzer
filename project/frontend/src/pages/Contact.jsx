import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO(backend): POST /api/contact
    setSent(true);
  }

  return (
    <div className="page-container" style={{ maxWidth: 480 }}>
      <h2 style={{ marginBottom: "0.4rem" }}>Contact Us</h2>
      <p style={{ marginBottom: "1.5rem" }}>Questions or feedback? Send us a message.</p>

      {sent ? (
        <div className="surface" style={{ padding: "1.25rem" }}>
          ✅ Thanks, {form.name || "there"}! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              required
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
