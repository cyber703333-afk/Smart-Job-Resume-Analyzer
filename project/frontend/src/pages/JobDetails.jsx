import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 5;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function JobDetails() {
  const { id } = useParams();
  const { jobs, currentUser, applyToJob, fetchMyApplications, isJobSaved, toggleSaveJob } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [applied, setApplied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [matchResult, setMatchResult] = useState(null); // AI match score shown right after applying

  const job = jobs.find((j) => j.id === id);

  useEffect(() => {
    let cancelled = false;
    if (currentUser?.role === "candidate") {
      fetchMyApplications()
        .then((apps) => {
          if (!cancelled) setApplied(apps.some((a) => a.job.id === id));
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setCheckingStatus(false);
        });
    } else {
      setCheckingStatus(false);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser?.id]);

  if (!job) {
    return (
      <div className="page-container">
        <p>Job not found.</p>
      </div>
    );
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
      setResumeFile(null);
      return;
    }

    setFileError("");
    setResumeFile(file);
  }

  function handleRemoveFile() {
    setResumeFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleApply() {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "candidate") return;
    if (!resumeFile) {
      setFileError("Please attach your resume before applying.");
      return;
    }

    setSubmitting(true);
    setFileError("");
    try {
      const result = await applyToJob(job.id, resumeFile);
      setApplied(true);
      if (result?.matchScore != null) setMatchResult(result);
    } catch (err) {
      setFileError(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2>{job.title}</h2>
            <p style={{ marginTop: "0.25rem" }}>{job.company} · {job.location}</p>
          </div>
          <span className="status-pill status-review">{job.type}</span>
        </div>

        {currentUser?.role === "candidate" && (
          <button
            type="button"
            onClick={() => toggleSaveJob(job.id)}
            className="btn btn-outline btn-sm"
            style={{ marginTop: "0.75rem" }}
          >
            {isJobSaved(job.id) ? "★ Saved" : "☆ Save this job"}
          </button>
        )}

        <div style={{ display: "flex", gap: "1.5rem", margin: "1.25rem 0", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
          <span>💰 {job.salary}</span>
          <span>🗓 Posted {job.postedOn}</span>
        </div>

        <h4 style={{ marginBottom: "0.4rem" }}>About the role</h4>
        <p style={{ lineHeight: 1.6, marginBottom: "1.25rem" }}>{job.description}</p>

        <h4 style={{ marginBottom: "0.4rem" }}>What we're looking for</h4>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          {job.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        {job.extractedSkills?.length > 0 && (
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "0.6rem" }}>
            🤖 Skills detected in this posting: {job.extractedSkills.join(", ")}
          </p>
        )}

        {matchResult && (
          <div className="surface" style={{ padding: "1rem", margin: "1rem 0" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
              🤖 Your AI match score: {matchResult.matchScore}%
            </p>
            {matchResult.matchedSkills?.length > 0 && (
              <p style={{ fontSize: "0.82rem", color: "var(--color-success)" }}>
                ✓ Matched: {matchResult.matchedSkills.join(", ")}
              </p>
            )}
            {matchResult.missingSkills?.length > 0 && (
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                Consider adding: {matchResult.missingSkills.join(", ")}
              </p>
            )}
          </div>
        )}

        <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        {currentUser?.role === "recruiter" || currentUser?.role === "admin" ? (
          <p style={{ fontSize: "0.85rem" }}>Recruiter and admin accounts can't apply to jobs.</p>
        ) : checkingStatus ? (
          <p style={{ fontSize: "0.85rem" }}>Checking application status…</p>
        ) : applied ? (
          <div className="surface" style={{ padding: "0.9rem 1.1rem" }}>
            ✅ You've already applied to this role. Track its status from your dashboard.
          </div>
        ) : (
          <div>
            <div className="field">
              <label htmlFor="resume">Upload resume (PDF or Word, max {MAX_SIZE_MB}MB)</label>

              {!resumeFile ? (
                <label
                  htmlFor="resume"
                  className="surface"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    padding: "1.5rem 1rem",
                    border: "1.5px dashed var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>📄</span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    Click to choose a file
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                    .pdf, .doc or .docx
                  </span>
                </label>
              ) : (
                <div
                  className="surface"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.8rem 1rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                    <span style={{ fontSize: "1.2rem" }}>📄</span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 320,
                        }}
                      >
                        {resumeFile.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {formatSize(resumeFile.size)}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveFile} className="btn btn-outline btn-sm">
                    Remove
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {fileError && (
                <div className="form-error" style={{ marginTop: "0.6rem" }}>
                  {fileError}
                </div>
              )}
            </div>

            <button onClick={handleApply} className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting…" : currentUser ? "Apply now" : "Log in to apply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

