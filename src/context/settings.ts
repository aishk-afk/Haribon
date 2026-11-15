import { createContext, useContext } from "react";
import type { Settings } from "../lib/types";

export const SettingsContext = createContext<Settings>({});

export const useSettings = () => useContext(SettingsContext);
