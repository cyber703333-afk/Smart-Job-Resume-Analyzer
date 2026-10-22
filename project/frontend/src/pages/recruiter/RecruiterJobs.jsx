import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RecruiterJobs() {
  const { fetchMyJobs } = useApp();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyJobs()
      .then(setMyJobs)
      .catch((err) => setError(err.message || "Failed to load your jobs."))
      .finally(() => setLoading(false));
  }, [fetchMyJobs]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
        <h2>My Job Postings</h2>
        <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">
          + Post a new job
        </Link>
      </div>
      <p style={{ marginBottom: "1.5rem" }}>Manage your open roles and review applicants.</p>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : myJobs.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p>You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {myJobs.map((job) => (
            <div
              key={job.id}
              className="card"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}
            >
              <div>
                <h3 style={{ fontSize: "1rem" }}>{job.title}</h3>
                <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  {job.location} · {job.type} · Posted {job.postedOn}
                </p>
                {job.extractedSkills?.length > 0 && (
                  <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
                    🤖 Auto-detected skills: {job.extractedSkills.join(", ")}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="status-pill status-review">
                  {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                </span>
                <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline btn-sm">
                  View applicants
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
