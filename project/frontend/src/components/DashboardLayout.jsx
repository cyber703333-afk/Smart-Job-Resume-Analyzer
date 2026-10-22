import Sidebar from "./Sidebar";

export default function DashboardLayout({ items, children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar items={items} />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
