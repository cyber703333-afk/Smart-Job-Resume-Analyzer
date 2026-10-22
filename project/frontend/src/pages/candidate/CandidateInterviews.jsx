import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

function formatSlot(d) {
  return new Date(d).toLocaleString(undefined, {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function CandidateInterviews() {
  const { fetchMyInterviewsAsCandidate, confirmInterviewSlot } = useApp();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);

  function load() {
    setLoading(true);
    fetchMyInterviewsAsCandidate()
      .then(setInterviews)
      .catch((err) => setError(err.message || "Failed to load interviews."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [fetchMyInterviewsAsCandidate]);

  async function handleConfirm(interviewId, slot) {
    setConfirmingId(interviewId);
    try {
      await confirmInterviewSlot(interviewId, slot);
      load();
    } catch (err) {
      setError(err.message || "Failed to confirm slot.");
    } finally {
      setConfirmingId(null);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Interviews</h2>
      <p style={{ marginBottom: "1.5rem" }}>Pick a time for interviews recruiters have proposed.</p>

      {error && <div className="form-error">{error}</div>}

      {interviews.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p>No interview invitations yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {interviews.map((iv) => (
            <div key={iv.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <h3 style={{ fontSize: "1rem" }}>{iv.job?.title || "Interview"}</h3>
                <span className={`status-pill ${iv.status === "Confirmed" ? "status-selected" : "status-shortlisted"}`}>
                  {iv.status}
                </span>
              </div>

              {iv.status === "Confirmed" ? (
                <p style={{ fontSize: "0.9rem" }}>
                  ✅ Confirmed for <strong>{formatSlot(iv.confirmedSlot)}</strong>
                  {iv.notes ? ` — ${iv.notes}` : ""}
                </p>
              ) : (
                <>
                  <p style={{ fontSize: "0.85rem", marginBottom: "0.6rem" }}>Choose a time that works for you:</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {iv.proposedSlots.map((slot) => (
                      <button
                        key={slot}
                        className="btn btn-outline btn-sm"
                        disabled={confirmingId === iv.id}
                        onClick={() => handleConfirm(iv.id, slot)}
                      >
                        {formatSlot(slot)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
