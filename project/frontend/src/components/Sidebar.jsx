import { NavLink } from "react-router-dom";

export default function Sidebar({ items }) {
  return (
    <aside
      style={{
        width: 230,
        borderRight: "1px solid var(--color-border)",
        padding: "2rem 1rem",
        background: "var(--color-surface)",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              padding: "0.6rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: isActive ? "var(--color-primary-dark)" : "var(--color-text-muted)",
              background: isActive ? "var(--color-primary-light)" : "transparent",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
