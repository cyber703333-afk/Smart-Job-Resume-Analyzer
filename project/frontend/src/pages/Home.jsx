// import { Link } from "react-router-dom";
// import { useApp } from "../context/AppContext";
// import JobCard from "../components/JobCard";

// export default function Home() {
//   const { jobs } = useApp();

//   const featuredJobs = jobs.slice(0, 3);
//   const companyCount = new Set(jobs.map((j) => j.company)).size;

//   const stats = [
//     { label: "Open Roles", value: jobs.length },
//     { label: "Companies Hiring", value: companyCount },
//   ];

//   return (
//     <div>
//       {/* Hero */}
//       <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
//         <div
//           className="page-container"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-start",
//             gap: "1.25rem",
//             paddingTop: "3.5rem",
//             paddingBottom: "3.5rem",
//           }}
//         >
//           <span
//             className="status-pill status-review"
//             style={{ fontSize: "0.75rem" }}
//           >
//             Smart Job & Recruitment Management Platform
//           </span>
//           <h1 style={{ fontSize: "2.3rem", lineHeight: 1.2, maxWidth: 560 }}>
//             Hiring and job-hunting, without the spreadsheets.
//           </h1>
//           <p style={{ fontSize: "1rem", maxWidth: 520, lineHeight: 1.6 }}>
//             One platform for candidates to find and track opportunities, and for recruiters
//             to post roles and manage applicants — all in one place.
//           </p>
//           <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
//             <Link to="/jobs" className="btn btn-primary">
//               Browse open roles
//             </Link>
//             <Link to="/register" className="btn btn-outline">
//               Post a job as a recruiter
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Stats */}
//       <div className="page-container" style={{ paddingBottom: 0 }}>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginTop: "-1.5rem" }}>
//           {stats.map((s) => (
//             <div key={s.label} className="card" style={{ background: "#fff" }}>
//               <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{s.value}</h3>
//               <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{s.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Featured jobs */}
//       <div className="page-container">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
//           <h2 style={{ fontSize: "1.4rem" }}>Featured openings</h2>
//           <Link to="/jobs" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-primary)" }}>
//             View all →
//           </Link>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
//           {featuredJobs.map((job) => (
//             <JobCard key={job.id} job={job} />
//           ))}
//         </div>
//       </div>

//       {/* How it works */}
//       <div className="page-container">
//         <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem" }}>How it works</h2>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
//           {[
//             { title: "1. Create an account", body: "Sign up as a candidate to apply, or a recruiter to hire." },
//             { title: "2. Post or apply", body: "Recruiters post roles in minutes; candidates apply with one click." },
//             { title: "3. Track everything", body: "Live status updates, from Applied to Selected — no more guessing." },
//           ].map((step) => (
//             <div key={step.title} className="surface" style={{ padding: "1.25rem" }}>
//               <h4 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>{step.title}</h4>
//               <p style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>{step.body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import JobCard from "../components/JobCard";

export default function Home() {
  const { jobs } = useApp();

  const featuredJobs = jobs.slice(0, 3);
  const companyCount = new Set(jobs.map((j) => j.company)).size;

  // Company ke naam + har company ke kitne open roles
  const companyMap = {};
  jobs.forEach((j) => {
    if (!j.company) return;
    companyMap[j.company] = (companyMap[j.company] || 0) + 1;
  });
  const hiringCompanies = Object.entries(companyMap)
    .map(([name, openRoles]) => ({ name, openRoles }))
    .sort((a, b) => b.openRoles - a.openRoles);

  const stats = [
    { label: "Open Roles", value: jobs.length },
    { label: "Companies Hiring", value: companyCount },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div
          className="page-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1.25rem",
            paddingTop: "3.5rem",
            paddingBottom: "3.5rem",
          }}
        >
          <span
            className="status-pill status-review"
            style={{ fontSize: "0.75rem" }}
          >
            Smart Job & Recruitment Management Platform
          </span>
          <h1 style={{ fontSize: "2.3rem", lineHeight: 1.2, maxWidth: 560 }}>
            Hiring and job-hunting, without the spreadsheets.
          </h1>
          <p style={{ fontSize: "1rem", maxWidth: 520, lineHeight: 1.6 }}>
            One platform for candidates to find and track opportunities, and for recruiters
            to post roles and manage applicants — all in one place.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/jobs" className="btn btn-primary">
              Browse open roles
            </Link>
            <Link to="/register" className="btn btn-outline">
              Post a job as a recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="page-container" style={{ paddingBottom: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginTop: "-1.5rem" }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ background: "#fff" }}>
              <h3 style={{ fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{s.value}</h3>
              <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Companies hiring */}
      {hiringCompanies.length > 0 && (
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem" }}>
            Companies hiring now ({hiringCompanies.length})
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {hiringCompanies.map((c) => (
              <Link
                key={c.name}
                to={`/jobs?search=${encodeURIComponent(c.name)}`}
                className="surface"
                style={{
                  padding: "0.7rem 1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                }}
              >
                {c.name}
                <span
                  className="status-pill status-review"
                  style={{ fontSize: "0.72rem", fontWeight: 500 }}
                >
                  {c.openRoles} {c.openRoles === 1 ? "role" : "roles"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured jobs */}
      <div className="page-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.4rem" }}>Featured openings</h2>
          <Link to="/jobs" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-primary)" }}>
            View all →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="page-container">
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem" }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { title: "1. Create an account", body: "Sign up as a candidate to apply, or a recruiter to hire." },
            { title: "2. Post or apply", body: "Recruiters post roles in minutes; candidates apply with one click." },
            { title: "3. Track everything", body: "Live status updates, from Applied to Selected — no more guessing." },
          ].map((step) => (
            <div key={step.title} className="surface" style={{ padding: "1.25rem" }}>
              <h4 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>{step.title}</h4>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
