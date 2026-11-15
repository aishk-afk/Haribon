import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage } from "../lib/api";
import { slugify } from "../lib/format";
import type { Page, Status } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { ConfirmDialog, Field, Notice, StatusBadge } from "./ui";
import type { ConfirmState, NoticeState } from "./ui";

const CORE_SLUGS = ["home", "about", "donate"];
const fetchPages = () => adminApi.pages();

export default function PagesAdmin() {
  const { data, loading, error, reload } = useAsync(fetchPages);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const toggle = async (page: Page) => {
    const next: Status = page.status === "published" ? "draft" : "published";
    try {
      await adminApi.setPageStatus(page.id, next);
      setNotice({ type: "success", message: `“${page.title}” is now ${next === "published" ? "published" : "unpublished"}.` });
      reload();
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    }
  };

  const remove = (page: Page) =>
    setConfirm({
      title: "Delete page?",
      message: `“${page.title}” and all of its sections will be permanently deleted.`,
      confirmLabel: "Delete page",
      onConfirm: async () => {
        try {
          await adminApi.deletePage(page.id);
          setNotice({ type: "success", message: "Page deleted." });
          reload();
        } catch (err) {
          setNotice({ type: "error", message: errorMessage(err) });
        }
      },
    });

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const page = await adminApi.createPage({ title, slug: slug || slugify(title), status });
      navigate(`/admin/pages/${page.id}`);
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
      setCreating(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "No data."} onRetry={reload} />;

  return (
    <>
      <h1>Pages</h1>
      <p className="adm-muted">Edit the content sections of each page. Core pages can be unpublished but not deleted.</p>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>Slug</th><th>Sections</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.map((page) => (
              <tr key={page.id}>
                <td data-label="Title"><strong>{page.title}</strong></td>
                <td data-label="Slug"><code>{page.slug}</code></td>
                <td data-label="Sections">{page.sections_count ?? 0}</td>
                <td data-label="Status"><StatusBadge status={page.status} /></td>
                <td data-label="Actions" className="adm-row-actions">
                  <Link className="adm-btn small" to={`/admin/pages/${page.id}`}>Edit content</Link>
                  <button type="button" className="adm-btn small" onClick={() => void toggle(page)}>
                    {page.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  {!CORE_SLUGS.includes(page.slug) && (
                    <button type="button" className="adm-btn small danger" onClick={() => remove(page)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="adm-card adm-details">
        <summary>Add a new page</summary>
        <form onSubmit={create} className="adm-form">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} />
          </Field>
          <Field label="Slug" hint="Lowercase letters, numbers and dashes. Leave empty to generate it from the title.">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title)} maxLength={100} />
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <button type="submit" className="adm-btn primary" disabled={creating}>{creating ? "Creating..." : "Create page"}</button>
        </form>
      </details>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
