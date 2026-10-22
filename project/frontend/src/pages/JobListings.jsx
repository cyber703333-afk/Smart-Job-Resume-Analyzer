import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import JobCard from "../components/JobCard";

export default function JobListings() {
  const { jobs, jobsLoading } = useApp();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const types = useMemo(() => ["All", ...new Set(jobs.map((j) => j.type))], [jobs]);

  const filtered = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "All" || job.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "0.3rem" }}>Browse open roles</h2>
      <p style={{ marginBottom: "1.5rem" }}>{filtered.length} opportunities available right now.</p>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or company"
          style={{
            flex: 1,
            minWidth: 220,
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.65rem 0.9rem",
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.65rem 0.9rem",
          }}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {jobsLoading ? (
        <p>Loading jobs…</p>
      ) : filtered.length === 0 ? (
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <p>No roles match your search. Try a different keyword or filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
