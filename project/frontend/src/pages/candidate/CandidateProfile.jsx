import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CandidateProfile() {
  const { currentUser, updateProfile } = useApp();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: currentUser.name,
    skills: currentUser.skills || "",
    education: currentUser.education || "",
  });

  function update(key, val) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>My Profile</h2>
      <p style={{ marginBottom: "1.5rem" }}>Keep this updated — recruiters see it with every application.</p>

      {saved && (
        <div className="surface" style={{ padding: "0.75rem 1rem", marginBottom: "1rem", color: "var(--color-success)" }}>
          ✅ Profile saved.
        </div>
      )}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSave} className="card" style={{ maxWidth: 480 }}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={currentUser.email} disabled />
        </div>
        <div className="field">
          <label htmlFor="education">Education</label>
          <input id="education" value={form.education} onChange={(e) => update("education", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="skills">Skills (comma separated)</label>
          <textarea
            id="skills"
            rows={3}
            value={form.skills}
            onChange={(e) => update("skills", e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
