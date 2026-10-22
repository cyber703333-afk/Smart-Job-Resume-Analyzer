import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, authError } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password).then((ok) => {
      if (ok) navigate("/jobs");
    });
  }

  return (
    <div className="page-container" style={{ maxWidth: 420 }}>
      <h2 style={{ marginBottom: "0.4rem" }}>Log in</h2>
      <p style={{ marginBottom: "1.5rem" }}>Access your candidate or recruiter dashboard.</p>

      {authError && <div className="form-error">{authError}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", paddingRight: "2.6rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                padding: "0.25rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-primary)",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Log in
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        No account yet? <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Sign up</Link>
      </p>

      <div className="surface" style={{ marginTop: "1.5rem", padding: "1rem", fontSize: "0.8rem" }}>
        <strong>Demo accounts</strong>
        <div>Candidate: aman@example.com / 1234</div>
        <div>Recruiter: priya@techcorp.com / 1234</div>
        <div>Admin: admin@platform.com / 1234</div>
      </div>
    </div>
  );
}
