import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
} from "recharts";
import { useApp } from "../../context/AppContext";

const FUNNEL_COLORS = {
  Applied: "#2F6FA8",
  "Under Review": "#4B3268",
  Shortlisted: "#C97A1A",
  Selected: "#2F9E44",
  Rejected: "#C0392B",
};

export default function RecruiterAnalytics() {
  const { fetchMyJobStats } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyJobStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, [fetchMyJobStats]);

  if (loading) return <p>Loading analytics…</p>;
  if (error) return <div className="form-error">{error}</div>;
  if (!stats || stats.totalJobs === 0) {
    return (
      <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
        <p>Post a job to start seeing analytics here.</p>
      </div>
    );
  }

  const perJobData = stats.perJob.map((j) => ({ name: j.title, Applications: j.totalApplications }));
  const funnelData = Object.entries(stats.totals.funnel).map(([stage, count]) => ({ stage, count }));

  return (
    <div>
      <h2 style={{ marginBottom: "0.3rem" }}>Analytics</h2>
      <p style={{ marginBottom: "1.5rem" }}>How your postings are performing, at a glance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card">
          <p style={{ fontSize: "0.8rem" }}>Jobs Posted</p>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{stats.totalJobs}</h3>
        </div>
        <div className="card">
          <p style={{ fontSize: "0.8rem" }}>Total Applications</p>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{stats.totals.totalApplications}</h3>
        </div>
        <div className="card">
          <p style={{ fontSize: "0.8rem" }}>Selected</p>
          <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)", color: "var(--color-success)" }}>
            {stats.totals.funnel.Selected || 0}
          </h3>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Applications per job</h4>
        <ResponsiveContainer width="100%" height={Math.max(200, perJobData.length * 50)}>
          <BarChart data={perJobData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Applications" fill="#6F4E9C" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Hiring funnel (all jobs)</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {funnelData.map((entry) => (
                <Cell key={entry.stage} fill={FUNNEL_COLORS[entry.stage] || "#6F4E9C"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
