import { useState } from "react";
import type { FormEvent } from "react";
import { adminApi, errorMessage } from "../lib/api";
import { blankToNull } from "../lib/format";
import { ICON_NAMES } from "../lib/icons";
import type { Section, SectionInput } from "../lib/types";
import { Field, ImagePicker, Notice } from "./ui";
import type { NoticeState } from "./ui";

interface Props {
  pageId: number;
  section?: Section;
  /** Called after a successful save or delete so the page can reload its data. */
  onChanged: (message: string) => void;
  onDelete?: (section: Section) => void;
}

const empty: SectionInput = {
  section_key: "",
  eyebrow: null,
  heading: null,
  body: null,
  icon: null,
  image_path: null,
  button_text: null,
  button_url: null,
  button2_text: null,
  button2_url: null,
  display_order: null,
};

const fromSection = (s: Section): SectionInput => ({
  section_key: s.section_key,
  eyebrow: s.eyebrow,
  heading: s.heading,
  body: s.body,
  icon: s.icon,
  image_path: s.image_path,
  button_text: s.button_text,
  button_url: s.button_url,
  button2_text: s.button2_text,
  button2_url: s.button2_url,
  display_order: s.display_order,
});

export default function SectionForm({ pageId, section, onChanged, onDelete }: Props) {
  const [form, setForm] = useState<SectionInput>(section ? fromSection(section) : empty);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SectionInput>(key: K, value: SectionInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const payload: SectionInput = {
      section_key: form.section_key.trim(),
      eyebrow: blankToNull(form.eyebrow),
      heading: blankToNull(form.heading),
      body: blankToNull(form.body),
      icon: blankToNull(form.icon),
      image_path: form.image_path,
      button_text: blankToNull(form.button_text),
      button_url: blankToNull(form.button_url),
      button2_text: blankToNull(form.button2_text),
      button2_url: blankToNull(form.button2_url),
      display_order: form.display_order,
    };

    try {
      if (section) {
        await adminApi.updateSection(section.id, payload);
        setNotice({ type: "success", message: "Saved. The public website now shows this change." });
        onChanged(`Section “${payload.section_key}” saved.`);
      } else {
        await adminApi.createSection(pageId, payload);
        setForm(empty);
        onChanged(`Section “${payload.section_key}” created.`);
      }
    } catch (err) {
      setNotice({ type: "error", message: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="adm-form">
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="adm-two">
        <Field
          label="Section key"
          hint={section ? "Used by the website to find this block. Change with care." : "Lowercase letters, numbers, dashes and underscores."}
        >
          <input value={form.section_key} onChange={(e) => set("section_key", e.target.value)} required maxLength={100} />
        </Field>
        <Field label="Display order">
          <input
            type="number"
            min={0}
            max={9999}
            value={form.display_order ?? ""}
            onChange={(e) => set("display_order", e.target.value === "" ? null : Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="adm-two">
        <Field label="Small heading above the title">
          <input value={form.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} maxLength={255} />
        </Field>
        <Field label="Heading">
          <input value={form.heading ?? ""} onChange={(e) => set("heading", e.target.value)} maxLength={255} />
        </Field>
      </div>

      <Field label="Text" hint="Leave a blank line between paragraphs. Plain text only.">
        <textarea rows={5} value={form.body ?? ""} onChange={(e) => set("body", e.target.value)} maxLength={5000} />
      </Field>

      <div className="adm-two">
        <Field label="Icon">
          <select value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)}>
            <option value="">None</option>
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>
        <div />
      </div>

      <ImagePicker label="Image" value={form.image_path} onChange={(path) => set("image_path", path)} />

      <div className="adm-two">
        <Field label="Button text">
          <input value={form.button_text ?? ""} onChange={(e) => set("button_text", e.target.value)} maxLength={255} />
        </Field>
        <Field label="Button link" hint="A page such as /donate, an anchor such as #pillars, or a full https:// address.">
          <input value={form.button_url ?? ""} onChange={(e) => set("button_url", e.target.value)} maxLength={255} />
        </Field>
      </div>
      <div className="adm-two">
        <Field label="Second button text">
          <input value={form.button2_text ?? ""} onChange={(e) => set("button2_text", e.target.value)} maxLength={255} />
        </Field>
        <Field label="Second button link">
          <input value={form.button2_url ?? ""} onChange={(e) => set("button2_url", e.target.value)} maxLength={255} />
        </Field>
      </div>

      <div className="adm-actions start">
        <button type="submit" className="adm-btn primary" disabled={saving}>
          {saving ? "Saving..." : section ? "Save section" : "Add section"}
        </button>
        {section && onDelete && (
          <button type="button" className="adm-btn danger" onClick={() => onDelete(section)}>
            Delete section
          </button>
        )}
      </div>
    </form>
  );
}
