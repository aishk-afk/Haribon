import type { Section } from "./types";

export const sectionByKey = (sections: Section[], key: string): Section | undefined =>
  sections.find((s) => s.section_key === key);

export const sectionsWithPrefix = (sections: Section[], prefix: string): Section[] =>
  sections.filter((s) => s.section_key.startsWith(prefix));

/** Splits editor text into paragraphs on blank lines. */
export const toParagraphs = (text: string | null | undefined): string[] =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
