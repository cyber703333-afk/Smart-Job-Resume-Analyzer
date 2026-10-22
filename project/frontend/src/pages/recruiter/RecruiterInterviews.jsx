import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

function formatSlot(d) {
  return new Date(d).toLocaleString(undefined, {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function RecruiterInterviews() {
  const { fetchMyInterviewsAsRecruiter } = useApp();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyInterviewsAsRecruiter()
      .then(setInterviews)
      .catch((err) => setError(err.message || "Failed to load interviews."))
      .finally(() => setLoading(false));
  }, [fetchMyInterviewsAsRecruiter]);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Interviews</h2>
      <p style={{ marginBottom: "1.5rem" }}>Interviews you've proposed to candidates.</p>

      {error && <div className="form-error">{error}</div>}

      {interviews.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p>You haven't scheduled any interviews yet — propose one from an applicant's profile.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {interviews.map((iv) => (
            <div key={iv.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem" }}>{iv.candidateName} — {iv.jobTitle}</h3>
                <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  {iv.status === "Confirmed"
                    ? `Confirmed for ${formatSlot(iv.confirmedSlot)}`
                    : `${iv.proposedSlots.length} slot(s) proposed, awaiting candidate`}
                </p>
              </div>
              <span className={`status-pill ${iv.status === "Confirmed" ? "status-selected" : "status-shortlisted"}`}>
                {iv.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
