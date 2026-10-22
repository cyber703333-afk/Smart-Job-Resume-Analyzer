import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function JobCard({ job }) {
  const { currentUser, isJobSaved, toggleSaveJob } = useApp();
  const saved = isJobSaved(job.id);
  const canSave = currentUser?.role === "candidate";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem" }}>{job.title}</h3>
          <p style={{ fontSize: "0.88rem", marginTop: "0.15rem" }}>{job.company}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span className="status-pill status-review">{job.type}</span>
          {canSave && (
            <button
              type="button"
              onClick={() => toggleSaveJob(job.id)}
              aria-label={saved ? "Remove from saved jobs" : "Save job"}
              title={saved ? "Remove from saved jobs" : "Save job"}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.1rem",
                lineHeight: 1,
                color: saved ? "var(--color-primary)" : "var(--color-text-muted)",
              }}
            >
              {saved ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
      </div>

      <p style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
        {job.description.slice(0, 120)}
        {job.description.length > 120 ? "…" : ""}
      </p>

      <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
        View details
      </Link>
    </div>
  );
}
