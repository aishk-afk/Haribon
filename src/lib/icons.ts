import type { IconName } from "../components/Icon";

// Must match `icons` in backend/config/cms.php.
export const ICON_NAMES = [
  "logo",
  "donate",
  "member",
  "partner",
  "volunteer",
  "forest",
  "species",
  "people",
  "sustainability",
] as const satisfies readonly IconName[];

export function isIconName(value: string | null | undefined): value is IconName {
  return !!value && (ICON_NAMES as readonly string[]).includes(value);
}
