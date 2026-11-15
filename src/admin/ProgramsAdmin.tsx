import { useState } from "react";
import type { FormEvent } from "react";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage } from "../lib/api";
import { blankToNull } from "../lib/format";
import { ICON_NAMES } from "../lib/icons";
import type { Program, ProgramInput, Status } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { ConfirmDialog, Field, ImagePicker, Notice, StatusBadge } from "./ui";
import type { ConfirmState, NoticeState } from "./ui";

const fetchPrograms = () => adminApi.programs();

function ProgramForm({
  program,
  onSaved,
  onCancel,
}: {
  program: Program | null;
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(program?.title ?? "");
  const [description, setDescription] = useState(program?.description ?? "");
  const [icon, setIcon] = useState(program?.icon ?? "");
  const [items, setItems] = useState((program?.items ?? []).join("\n"));
  const [imagePath, setImagePath] = useState<string | null>(program?.image_path ?? null);
  const [status, setStatus] = useState<Status>(program?.status ?? "published");
  const [order, setOrder] = useState<string>(program ? String(program.display_order) : "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const payload: ProgramInput = {
      title: title.trim(),
      description: blankToNull(description),
      icon: blankToNull(icon),
      items: items.split("\n").map((i) => i.trim()).filter(Boolean),
      image_path: imagePath,
      status,
      display_order: order === "" ? null : Number(order),
    };

    try {
      if (program) await adminApi.updateProgram(program.id, payload);
      else await adminApi.createProgram(payload);
      onSaved(program ? "Program saved." : "Program created.");
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="adm-card adm-form">
      <h2>{program ? `Edit “${program.title}”` : "New program"}</h2>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} />
      </Field>
      <Field label="Description" hint="Leave a blank line between paragraphs.">
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
      </Field>
      <Field label="Programs under this pillar" hint="One per line. Shown as small tags.">
        <textarea rows={4} value={items} onChange={(e) => setItems(e.target.value)} />
      </Field>
      <div className="adm-two">
        <Field label="Icon">
          <select value={icon} onChange={(e) => setIcon(e.target.value)}>
            <option value="">None</option>
            {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </Field>
        <Field label="Display order">
          <input type="number" min={0} max={9999} value={order} onChange={(e) => setOrder(e.target.value)} />
        </Field>
      </div>
      <ImagePicker label="Image (optional)" value={imagePath} onChange={setImagePath} />
      <Field label="Status">
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="published">Published</option>
          <option value="draft">Draft (hidden from visitors)</option>
        </select>
      </Field>
      <div className="adm-actions start">
        <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? "Saving..." : "Save program"}</button>
        <button type="button" className="adm-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function ProgramsAdmin() {
  const { data, loading, error, reload } = useAsync(fetchPrograms);
  const [editing, setEditing] = useState<Program | "new" | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const toggle = async (program: Program) => {
    const next: Status = program.status === "published" ? "draft" : "published";
    try {
      await adminApi.setProgramStatus(program.id, next);
      setNotice({ type: "success", message: `“${program.title}” is now ${next === "published" ? "published" : "unpublished"}.` });
      reload();
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    }
  };

  const remove = (program: Program) =>
    setConfirm({
      title: "Delete program?",
      message: `“${program.title}” will be permanently deleted.`,
      confirmLabel: "Delete program",
      onConfirm: async () => {
        try {
          await adminApi.deleteProgram(program.id);
          setNotice({ type: "success", message: "Program deleted." });
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
      <h1>Programs</h1>
      <p className="adm-muted">The pillars and programs shown in “Our four pillars” on the home page.</p>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      {editing ? (
        <ProgramForm
          key={editing === "new" ? "new" : editing.id}
          program={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setNotice({ type: "success", message });
            reload();
          }}
        />
      ) : (
        <div className="adm-actions start">
          <button type="button" className="adm-btn primary" onClick={() => setEditing("new")}>New program</button>
        </div>
      )}

      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Order</th><th>Title</th><th>Programs listed</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={5}>No programs yet.</td></tr>}
            {data.map((p) => (
              <tr key={p.id}>
                <td data-label="Order">{p.display_order}</td>
                <td data-label="Title"><strong>{p.title}</strong></td>
                <td data-label="Programs listed">{p.items?.length ?? 0}</td>
                <td data-label="Status"><StatusBadge status={p.status} /></td>
                <td data-label="Actions" className="adm-row-actions">
                  <button type="button" className="adm-btn small" onClick={() => setEditing(p)}>Edit</button>
                  <button type="button" className="adm-btn small" onClick={() => void toggle(p)}>
                    {p.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" className="adm-btn small danger" onClick={() => remove(p)}>Delete</button>
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
