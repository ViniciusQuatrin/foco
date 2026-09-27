"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { applyThemeToDocument, loadConfig, saveConfig } from "@/lib/storage";
import { AppConfig, DEFAULT_CONFIG, Theme } from "@/lib/types";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  config: AppConfig;
  setConfig: (c: AppConfig) => void;
  ready: boolean;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<AppConfig>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadConfig();
    setConfigState(loaded);
    applyThemeToDocument(loaded.theme);
    setReady(true);
  }, []);

  const setConfig = useCallback((c: AppConfig) => {
    setConfigState(c);
    saveConfig(c);
    applyThemeToDocument(c.theme);
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setConfig({ ...config, theme: t });
    },
    [config, setConfig],
  );

  const toggleTheme = useCallback(() => {
    setTheme(config.theme === "dark" ? "light" : "dark");
  }, [config.theme, setTheme]);

  const value = useMemo(
    () => ({
      theme: config.theme,
      setTheme,
      toggleTheme,
      config,
      setConfig,
      ready,
    }),
    [config, setTheme, toggleTheme, setConfig, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme outside ThemeProvider");
  return v;
}
