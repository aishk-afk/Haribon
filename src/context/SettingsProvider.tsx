import type { ReactNode } from "react";
import { publicApi } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { SettingsContext } from "./settings";

const fetchSettings = () => publicApi.settings();

/** Loads the website settings (organization name, contact details, links) once for the whole site. */
export default function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useAsync(fetchSettings);

  return <SettingsContext.Provider value={data ?? {}}>{children}</SettingsContext.Provider>;
}
