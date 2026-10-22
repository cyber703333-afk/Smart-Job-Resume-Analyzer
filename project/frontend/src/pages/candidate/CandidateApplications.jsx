import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusPill from "../../components/StatusPill";

export default function CandidateApplications() {
  const { fetchMyApplications } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch((err) => setError(err.message || "Failed to load applications."))
      .finally(() => setLoading(false));
  }, [fetchMyApplications]);

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>My Applications</h2>
      <p style={{ marginBottom: "1.5rem" }}>Track the status of every role you've applied to.</p>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : applications.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ marginBottom: "0.75rem" }}>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Browse open roles
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {applications.map((a) => (
            <div
              key={a.id}
              className="card"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}
            >
              <div>
                <h3 style={{ fontSize: "1rem" }}>{a.job?.title}</h3>
                <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  {a.job?.company} · Applied on {a.appliedOn}
                  {a.matchScore != null && <> · 🤖 {a.matchScore}% match</>}
                </p>
              </div>
              <StatusPill status={a.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
