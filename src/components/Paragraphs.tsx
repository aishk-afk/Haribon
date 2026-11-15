import { toParagraphs } from "../lib/sections";

/** Renders editor text as paragraphs. The text is rendered as plain text, never as HTML. */
export default function Paragraphs({ text, className }: { text: string | null | undefined; className?: string }) {
  return (
    <>
      {toParagraphs(text).map((paragraph, i) => (
        <p key={i} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
