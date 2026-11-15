import { useState } from "react";
import type { FormEvent } from "react";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage } from "../lib/api";
import { formatDate } from "../lib/format";
import type { Announcement, Status } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { ConfirmDialog, Field, ImagePicker, Notice, StatusBadge } from "./ui";
import type { ConfirmState, NoticeState } from "./ui";

const fetchAnnouncements = () => adminApi.announcements();

function AnnouncementForm({
  announcement,
  onSaved,
  onCancel,
}: {
  announcement: Announcement | null;
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [content, setContent] = useState(announcement?.content ?? "");
  const [imagePath, setImagePath] = useState<string | null>(announcement?.image_path ?? null);
  const [status, setStatus] = useState<Status>(announcement?.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    const payload = { title: title.trim(), content: content.trim(), image_path: imagePath, status };

    try {
      if (announcement) await adminApi.updateAnnouncement(announcement.id, payload);
      else await adminApi.createAnnouncement(payload);
      onSaved(announcement ? "Announcement saved." : "Announcement created.");
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="adm-card adm-form">
      <h2>{announcement ? "Edit announcement" : "New announcement"}</h2>
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} />
      </Field>
      <Field label="Message" hint="Leave a blank line between paragraphs. Plain text only.">
        <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} required maxLength={10000} />
      </Field>
      <ImagePicker label="Image (optional)" value={imagePath} onChange={setImagePath} />
      <Field label="Status" hint="Publishing sets the publication date. Drafts are never shown to visitors.">
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </Field>
      <div className="adm-actions start">
        <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? "Saving..." : "Save announcement"}</button>
        <button type="button" className="adm-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function AnnouncementsAdmin() {
  const { data, loading, error, reload } = useAsync(fetchAnnouncements);
  const [editing, setEditing] = useState<Announcement | "new" | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const toggle = async (item: Announcement) => {
    const next: Status = item.status === "published" ? "draft" : "published";
    try {
      await adminApi.setAnnouncementStatus(item.id, next);
      setNotice({ type: "success", message: `“${item.title}” is now ${next === "published" ? "published" : "unpublished"}.` });
      reload();
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    }
  };

  const remove = (item: Announcement) =>
    setConfirm({
      title: "Delete announcement?",
      message: `“${item.title}” will be permanently deleted.`,
      confirmLabel: "Delete announcement",
      onConfirm: async () => {
        try {
          await adminApi.deleteAnnouncement(item.id);
          setNotice({ type: "success", message: "Announcement deleted." });
          reload();
        } catch (err) {
          setNotice({ type: "error", message: errorMessage(err) });
        }
      },
    });

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "No data."} onRetry={reload} />;

  return (
    <>
      <h1>Announcements</h1>
      <p className="adm-muted">Published announcements appear in “Latest announcements” on the home page.</p>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      {editing ? (
        <AnnouncementForm
          key={editing === "new" ? "new" : editing.id}
          announcement={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setNotice({ type: "success", message });
            reload();
          }}
        />
      ) : (
        <div className="adm-actions start">
          <button type="button" className="adm-btn primary" onClick={() => setEditing("new")}>New announcement</button>
        </div>
      )}

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Title</th><th>Published on</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={4}>No announcements yet.</td></tr>}
            {data.map((a) => (
              <tr key={a.id}>
                <td data-label="Title"><strong>{a.title}</strong></td>
                <td data-label="Published on">{formatDate(a.published_at)}</td>
                <td data-label="Status"><StatusBadge status={a.status} /></td>
                <td data-label="Actions" className="adm-row-actions">
                  <button type="button" className="adm-btn small" onClick={() => setEditing(a)}>Edit</button>
                  <button type="button" className="adm-btn small" onClick={() => void toggle(a)}>
                    {a.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" className="adm-btn small danger" onClick={() => remove(a)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
