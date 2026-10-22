import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function PostJob() {
  const { postJob } = useApp();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
  });

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await postJob(form);
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(err.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Post a new job</h2>
      <p style={{ marginBottom: "1.5rem" }}>This listing goes live for candidates immediately.</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560 }}>
        <div className="field">
          <label htmlFor="title">Job title</label>
          <input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="location">Location</label>
            <input id="location" required value={form.location} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="type">Job type</label>
            <select id="type" value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="salary">Salary / stipend</label>
          <input id="salary" placeholder="e.g. ₹4,00,000/year" value={form.salary} onChange={(e) => update("salary", e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="description">Job description</label>
          <textarea
            id="description"
            rows={4}
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="requirements">Requirements (comma separated)</label>
          <textarea
            id="requirements"
            rows={2}
            placeholder="React, Git, Problem solving"
            value={form.requirements}
            onChange={(e) => update("requirements", e.target.value)}
          />
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
            🤖 Our AI will also auto-detect skills from your description and requirements, and use them to score applicant resumes.
          </p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Publishing…" : "Publish job"}
        </button>
      </form>
    </div>
  );
}
