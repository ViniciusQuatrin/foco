"use client";

import {
  AppConfig,
  DEFAULT_CONFIG,
  HistoryItem,
  STORAGE_KEYS,
  Theme,
} from "./types";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const parsed = safeParse<Partial<AppConfig>>(
    localStorage.getItem(STORAGE_KEYS.config),
    {},
  );
  const themeStored = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    theme:
      themeStored === "light" || themeStored === "dark"
        ? themeStored
        : parsed.theme ?? DEFAULT_CONFIG.theme,
  };
}

export function saveConfig(config: AppConfig): void {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  localStorage.setItem(STORAGE_KEYS.theme, config.theme);
}

export function loadSessionName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEYS.sessionName) ?? "";
}

export function saveSessionName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.sessionName, name);
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  const items = safeParse<HistoryItem[]>(
    localStorage.getItem(STORAGE_KEYS.history),
    [],
  );
  return Array.isArray(items) ? items : [];
}

export function saveHistory(items: HistoryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(items));
}

export function addHistoryItem(item: HistoryItem): HistoryItem[] {
  const next = [item, ...loadHistory()];
  saveHistory(next);
  return next;
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}
