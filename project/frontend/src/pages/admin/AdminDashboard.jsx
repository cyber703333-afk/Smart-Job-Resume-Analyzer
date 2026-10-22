import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../api/client";

export default function AdminDashboard() {
  const { token } = useApp();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/admin/stats", token), api.get("/admin/users", token)])
      .then(([statsData, usersData]) => {
        setStats(statsData);
        setUsers(usersData);
      })
      .catch((err) => setError(err.message || "Failed to load admin data."))
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers },
        { label: "Candidates", value: stats.candidates },
        { label: "Recruiters", value: stats.recruiters },
        { label: "Active Jobs", value: stats.totalJobs },
        { label: "Applications", value: stats.totalApplications },
      ]
    : [];

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Admin Overview</h2>
      <p style={{ marginBottom: "1.5rem" }}>Platform-wide stats across users, jobs and applications.</p>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {statCards.map((s) => (
              <div key={s.label} className="card">
                <p style={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}>{s.label}</p>
                <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{s.value}</h3>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: "0.75rem", fontSize: "1.05rem" }}>All Users</h3>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "var(--color-surface)", textAlign: "left" }}>
                  <th style={{ padding: "0.7rem 1rem" }}>Name</th>
                  <th style={{ padding: "0.7rem 1rem" }}>Email</th>
                  <th style={{ padding: "0.7rem 1rem" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.7rem 1rem" }}>{u.name}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>{u.email}</td>
                    <td style={{ padding: "0.7rem 1rem", textTransform: "capitalize" }}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
