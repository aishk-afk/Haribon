import { NavLink, Outlet } from "react-router-dom";
import { Loading } from "../components/StatusViews";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/programs", label: "Programs" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/settings", label: "Settings" },
];

/** Shows the dashboard shell, but only for a signed-in administrator. The API enforces this too. */
export default function AdminLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) return <Loading label="Checking your session..." />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="adm">
      <header className="adm-top">
        <strong className="adm-brand">Haribon CMS</strong>
        <nav aria-label="CMS sections" className="adm-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-user">
          <a href="/" target="_blank" rel="noreferrer">View website</a>
          <span className="adm-muted">{user.email}</span>
          <button type="button" className="adm-btn small" onClick={() => void logout()}>
            Log out
          </button>
        </div>
      </header>
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
