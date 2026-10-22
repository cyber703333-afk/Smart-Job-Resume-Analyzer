import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import JobCard from "../../components/JobCard";

export default function CandidateSavedJobs() {
  const { getSavedJobs } = useApp();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSavedJobs()
      .then(setSavedJobs)
      .catch((err) => setError(err.message || "Failed to load saved jobs."))
      .finally(() => setLoading(false));
  }, [getSavedJobs]);

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Saved Jobs</h2>
      <p style={{ marginBottom: "1.5rem" }}>Roles you've bookmarked to apply to later.</p>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : savedJobs.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ marginBottom: "0.75rem" }}>You haven't saved any jobs yet.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Browse open roles
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
