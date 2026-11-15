import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage } from "../lib/api";
import type { Page, Section, Status } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import SectionForm from "./SectionForm";
import { ConfirmDialog, Field, Notice } from "./ui";
import type { ConfirmState, NoticeState } from "./ui";

const CORE_SLUGS = ["home", "about", "donate"];

function PageSettings({ page, onSaved, onError }: { page: Page; onSaved: () => void; onError: (m: string) => void }) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<Status>(page.status);
  const [saving, setSaving] = useState(false);
  const core = CORE_SLUGS.includes(page.slug);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updatePage(page.id, { title, slug, status });
      onSaved();
    } catch (err) {
      onError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="adm-card adm-form">
      <h2>Page settings</h2>
      <div className="adm-two">
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} />
        </Field>
        <Field label="Slug" hint={core ? "Core pages keep their slug." : undefined}>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={core} required maxLength={100} />
        </Field>
      </div>
      <Field label="Status">
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="published">Published</option>
          <option value="draft">Draft (hidden from visitors)</option>
        </select>
      </Field>
      <div className="adm-actions start">
        <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? "Saving..." : "Save page settings"}</button>
      </div>
    </form>
  );
}

export default function PageEditor() {
  const id = Number(useParams().id);
  const fetchPage = useCallback(() => adminApi.page(id), [id]);
  const { data, loading, error, reload } = useAsync(fetchPage);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [newSectionKey, setNewSectionKey] = useState(0);

  const removeSection = (section: Section) =>
    setConfirm({
      title: "Delete section?",
      message: `“${section.heading ?? section.section_key}” will be removed from the page. This cannot be undone.`,
      confirmLabel: "Delete section",
      onConfirm: async () => {
        try {
          await adminApi.deleteSection(section.id);
          setNotice({ type: "success", message: "Section deleted." });
          reload();
        } catch (err) {
          setNotice({ type: "error", message: errorMessage(err) });
        }
      },
    });

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "Page not found."} onRetry={reload} />;

  const sections = data.sections ?? [];

  return (
    <>
      <p><Link to="/admin/pages">← All pages</Link></p>
      <h1>Edit: {data.title}</h1>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <PageSettings
        key={`${data.id}-${data.title}-${data.status}`}
        page={data}
        onSaved={() => {
          setNotice({ type: "success", message: "Page settings saved." });
          reload();
        }}
        onError={(message) => setNotice({ type: "error", message })}
      />

      <h2>Content sections ({sections.length})</h2>
      <p className="adm-muted">Open a section to edit it. Changes appear on the public page as soon as you save.</p>

      {sections.map((section) => (
        <details key={section.id} className="adm-card adm-details">
          <summary>
            <strong>{section.heading || section.section_key}</strong>
            <code>{section.section_key}</code>
          </summary>
          <SectionForm
            pageId={data.id}
            section={section}
            onChanged={(message) => {
              setNotice({ type: "success", message });
              reload();
            }}
            onDelete={removeSection}
          />
        </details>
      ))}

      <details className="adm-card adm-details">
        <summary><strong>+ Add a section</strong></summary>
        <SectionForm
          key={newSectionKey}
          pageId={data.id}
          onChanged={(message) => {
            setNotice({ type: "success", message });
            setNewSectionKey((k) => k + 1);
            reload();
          }}
        />
      </details>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
