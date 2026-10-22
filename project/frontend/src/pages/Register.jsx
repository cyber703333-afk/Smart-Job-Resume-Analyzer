import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Register() {
  const { register, authError } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    register(form).then((ok) => {
      if (ok) {
        navigate(form.role === "candidate" ? "/candidate/applications" : "/recruiter/jobs");
      }
    });
  }

  return (
    <div className="page-container" style={{ maxWidth: 460 }}>
      <h2 style={{ marginBottom: "0.4rem" }}>Create an account</h2>
      <p style={{ marginBottom: "1.5rem" }}>Sign up as a candidate to apply, or a recruiter to hire.</p>

      {authError && <div className="form-error">{authError}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>I am a</label>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {["candidate", "recruiter"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => update("role", r)}
                className={form.role === r ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                style={{ flex: 1, textTransform: "capitalize" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        {form.role === "recruiter" && (
          <div className="field">
            <label htmlFor="company">Company name</label>
            <input
              id="company"
              required
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
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
          Create account
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
