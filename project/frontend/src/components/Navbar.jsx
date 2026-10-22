import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { currentUser, logout, getMyNotifications, markNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const dashboardPath =
    currentUser?.role === "candidate"
      ? "/candidate/applications"
      : currentUser?.role === "recruiter"
      ? "/recruiter/jobs"
      : "/admin";

  const notifications = currentUser?.role === "candidate" ? getMyNotifications() : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  function toggleNotifications() {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) markNotificationsRead();
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0.9rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--color-primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.05rem" }}>
            Smart Job Platform
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link to="/" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
            Home
          </Link>
          <Link to="/jobs" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
            Browse Jobs
          </Link>
          <Link to="/about" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
            About
          </Link>
          <Link to="/contact" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
            Contact
          </Link>

          {!currentUser && (
            <>
              <Link to="/login" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}

          {currentUser && (
            <>
              <Link to={dashboardPath} style={{ fontSize: "0.92rem", fontWeight: 500 }}>
                Dashboard
              </Link>

              {currentUser.role === "candidate" && (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    aria-label="Notifications"
                    style={{
                      position: "relative",
                      background: "transparent",
                      border: "none",
                      fontSize: "1.1rem",
                    }}
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -6,
                          background: "var(--color-danger)",
                          color: "#fff",
                          borderRadius: "999px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.05rem 0.35rem",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div
                      className="card"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 0.5rem)",
                        width: 280,
                        maxHeight: 320,
                        overflowY: "auto",
                        zIndex: 10,
                        padding: "0.75rem",
                      }}
                    >
                      <h4 style={{ fontSize: "0.88rem", marginBottom: "0.6rem" }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: "0.82rem" }}>No notifications yet.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {notifications.map((n) => (
                            <div
                              key={n.id}
                              style={{
                                fontSize: "0.82rem",
                                padding: "0.5rem 0.6rem",
                                borderRadius: "var(--radius-sm)",
                                background: n.read ? "transparent" : "var(--color-primary-light)",
                              }}
                            >
                              {n.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                {currentUser.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
