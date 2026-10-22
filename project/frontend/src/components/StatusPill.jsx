const CLASS_MAP = {
  "Applied": "status-applied",
  "Under Review": "status-review",
  "Shortlisted": "status-shortlisted",
  "Selected": "status-selected",
  "Rejected": "status-rejected",
};

export default function StatusPill({ status }) {
  const className = CLASS_MAP[status] || "status-applied";
  return <span className={`status-pill ${className}`}>{status}</span>;
}
