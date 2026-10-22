export default function About() {
  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: "0.5rem" }}>About Us</h2>
      <p style={{ marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Smart Job & Recruitment Management Platform is a student project built to make
        hiring simpler for small organizations and college placement cells, and job
        searching simpler for candidates — without relying on third-party job boards.
      </p>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h4 style={{ marginBottom: "0.4rem" }}>Our mission</h4>
        <p style={{ lineHeight: 1.6 }}>
          Replace scattered spreadsheets and email threads with one clean dashboard where
          recruiters can post jobs and track applicants, and candidates always know exactly
          where their application stands.
        </p>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: "0.4rem" }}>What we're built on</h4>
        <p style={{ lineHeight: 1.6 }}>
          Frontend: React.js · Backend: Node.js with Express.js · Database: MySQL — a
          straightforward, reliable stack with no unnecessary automation.
        </p>
      </div>
    </div>
  );
}
