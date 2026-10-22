import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusPill from "../../components/StatusPill";
import { API_BASE } from "../../api/client";

const STATUS_OPTIONS = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"];

function matchColor(score) {
  if (score == null) return "var(--color-text-muted)";
  if (score >= 70) return "var(--color-success)";
  if (score >= 40) return "var(--color-warning)";
  return "var(--color-danger)";
}

function ScheduleInterviewForm({ applicationId, onClose, onScheduled }) {
  const { proposeInterview } = useApp();
  const [slots, setSlots] = useState(["", ""]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateSlot(i, val) {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validSlots = slots.filter(Boolean);
    if (validSlots.length === 0) {
      setError("Add at least one time slot.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await proposeInterview(applicationId, validSlots, notes);
      onScheduled();
    } catch (err) {
      setError(err.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface" style={{ padding: "1rem", marginTop: "0.75rem" }}>
      <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Propose interview slots</p>
      {slots.map((s, i) => (
        <div className="field" key={i} style={{ marginBottom: "0.5rem" }}>
          <input type="datetime-local" value={s} onChange={(e) => updateSlot(i, e.target.value)} />
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setSlots((p) => [...p, ""])} style={{ marginBottom: "0.75rem" }}>
        + Add another slot
      </button>
      <div className="field">
        <input placeholder="Notes (e.g. Google Meet link)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? "Sending…" : "Send invite"}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

export default function RecruiterApplicants() {
  const { id } = useParams();
  const { jobs, fetchApplicantsForJob, updateApplicationStatus } = useApp();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [schedulingFor, setSchedulingFor] = useState(null);
  const [scheduledIds, setScheduledIds] = useState([]);

  const job = jobs.find((j) => j.id === id);
  const apiOrigin = API_BASE.replace(/\/api\/?$/, "");

  useEffect(() => {
    fetchApplicantsForJob(id)
      .then(setApplicants)
      .catch((err) => setError(err.message || "Failed to load applicants."))
      .finally(() => setLoading(false));
  }, [id, fetchApplicantsForJob]);

  async function handleStatusChange(applicationId, status) {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setApplicants((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <Link to="/recruiter/jobs" style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>
        ← Back to my postings
      </Link>
      <h2 style={{ margin: "0.5rem 0 0.3rem" }}>{job?.title || "Job"}</h2>
      <p style={{ marginBottom: "1.5rem" }}>
        {applicants.length} applicant(s) for this role — sorted by AI match score.
      </p>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : applicants.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p>No applications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {applicants.map((a) => (
            <div key={a.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <h3 style={{ fontSize: "1rem" }}>{a.candidate?.name}</h3>
                    {a.matchScore != null && (
                      <span
                        title={`Matched skills: ${a.matchedSkills?.join(", ") || "—"}`}
                        style={{
                          fontSize: "0.75rem", fontWeight: 700, color: matchColor(a.matchScore),
                          border: `1px solid ${matchColor(a.matchScore)}`, borderRadius: "999px",
                          padding: "0.1rem 0.6rem",
                        }}
                      >
                        🤖 {a.matchScore}% match
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    {a.candidate?.email} · Applied {a.appliedOn} ·{" "}
                    <a href={`${apiOrigin}${a.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                      📄 {a.resumeName}
                    </a>
                  </p>
                  {a.matchScore != null && a.missingSkills?.length > 0 && (
                    <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                      Missing: {a.missingSkills.join(", ")}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <StatusPill status={a.status} />
                  <select
                    value={a.status}
                    disabled={updatingId === a.id}
                    onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "0.4rem 0.6rem" }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {(a.status === "Shortlisted" || a.status === "Selected") && !scheduledIds.includes(a.id) && (
                    <button className="btn btn-outline btn-sm" onClick={() => setSchedulingFor(schedulingFor === a.id ? null : a.id)}>
                      📅 Interview
                    </button>
                  )}
                </div>
              </div>

              {schedulingFor === a.id && (
                <ScheduleInterviewForm
                  applicationId={a.id}
                  onClose={() => setSchedulingFor(null)}
                  onScheduled={() => {
                    setSchedulingFor(null);
                    setScheduledIds((prev) => [...prev, a.id]);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
