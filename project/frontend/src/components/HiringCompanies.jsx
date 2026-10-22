import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HiringCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((r) => r.json())
      .then((data) => {
        const jobs = Array.isArray(data) ? data : data.jobs || [];
        const map = {};
        jobs.forEach((j) => {
          if (!j.company) return;
          map[j.company] = (map[j.company] || 0) + 1;
        });
        const list = Object.entries(map)
          .map(([name, openRoles]) => ({ name, openRoles }))
          .sort((a, b) => b.openRoles - a.openRoles);
        setCompanies(list);
      })
      .catch(() => {});
  }, []);

  if (companies.length === 0) return null;

  return (
    <section style={{ margin: "32px 0" }}>
      <h2>Companies Hiring ({companies.length})</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
        {companies.map((c) => (
          <Link
            key={c.name}
            to={`/jobs?search=${encodeURIComponent(c.name)}`}
            style={{
              padding: "10px 16px",
              border: "1px solid #e5e0ee",
              borderRadius: 10,
              background: "#f7f4fc",
              color: "#222",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {c.name}
            <span style={{ fontWeight: 400, marginLeft: 8, color: "#6b4c9a" }}>
              {c.openRoles} {c.openRoles === 1 ? "role" : "roles"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}