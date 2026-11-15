import { useState } from "react";
import type { FormEvent } from "react";
import { ErrorMessage, Loading } from "../components/StatusViews";
import { adminApi, errorMessage } from "../lib/api";
import type { Settings } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { Field, Notice } from "./ui";
import type { NoticeState } from "./ui";

const fetchSettings = () => adminApi.settings();

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea";
  hint?: string;
}

const FIELDS: FieldDef[] = [
  { key: "org_name", label: "Organization name", hint: "Shown in the top bar and footer." },
  { key: "footer_description", label: "Footer description", type: "textarea" },
  { key: "contact_address", label: "Address", type: "textarea" },
  { key: "contact_email", label: "Public email", type: "email" },
  { key: "contact_phone", label: "Public phone number" },
  { key: "facebook_url", label: "Facebook link", type: "url", hint: "Leave empty to hide the icon." },
  { key: "instagram_url", label: "Instagram link", type: "url" },
  { key: "linkedin_url", label: "LinkedIn link", type: "url" },
  { key: "footer_notice", label: "Footer notice", type: "textarea" },
  { key: "credits_note", label: "Credits line", type: "textarea" },
];

function SettingsForm({ initial }: { initial: Settings }) {
  const [values, setValues] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const payload: Settings = {};
    for (const f of FIELDS) {
      const value = (values[f.key] ?? "").trim();
      payload[f.key] = value === "" ? null : value;
    }

    try {
      setValues(await adminApi.updateSettings(payload));
      setNotice({ type: "success", message: "Settings saved. The footer and top bar are updated." });
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="adm-card adm-form">
      <Notice notice={notice} onClose={() => setNotice(null)} />
      {FIELDS.map((f) => (
        <Field key={f.key} label={f.label} hint={f.hint}>
          {f.type === "textarea" ? (
            <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
          ) : (
            <input
              type={f.type ?? "text"}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              required={f.key === "org_name"}
            />
          )}
        </Field>
      ))}
      <div className="adm-actions start">
        <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? "Saving..." : "Save settings"}</button>
      </div>
    </form>
  );
}

export default function SettingsAdmin() {
  const { data, loading, error, reload } = useAsync(fetchSettings);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorMessage message={error ?? "No data."} onRetry={reload} />;

  return (
    <>
      <h1>Website settings</h1>
      <p className="adm-muted">Public contact details and footer content. Payment settings are not managed here.</p>
      <SettingsForm initial={data} />
    </>
  );
}
