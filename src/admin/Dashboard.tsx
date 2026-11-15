import { Link } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi } from "../lib/api";
import { useAsync } from "../lib/useAsync";

const fetchDashboard = () => adminApi.dashboard();

export default function Dashboard() {
  const { data, loading, error, reload } = useAsync(fetchDashboard);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "No data."} onRetry={reload} />;

  const cards = [
    { to: "/admin/pages", label: "Pages", value: `${data.pages.published} of ${data.pages.total} published`, extra: `${data.sections} content sections` },
    { to: "/admin/programs", label: "Programs", value: `${data.programs.published} of ${data.programs.total} published`, extra: "Pillars shown on the home page" },
    { to: "/admin/announcements", label: "Announcements", value: `${data.announcements.published} of ${data.announcements.total} published`, extra: "News shown on the home page" },
    { to: "/admin/media", label: "Media", value: `${data.media} images`, extra: "Upload and reuse images" },
    { to: "/admin/settings", label: "Settings", value: "Contact and footer", extra: "Organization name, links, notice" },
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <p className="adm-muted">Everything below is stored in MySQL and served to the public website by Laravel.</p>
      <div className="adm-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="adm-card adm-stat">
            <span className="adm-label">{c.label}</span>
            <strong>{c.value}</strong>
            <span className="adm-muted">{c.extra}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
