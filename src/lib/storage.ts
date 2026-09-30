"use client";

import {
  AppConfig,
  CONFIG_VERSION,
  DEFAULT_CONFIG,
  DurationUnit,
  HistoryItem,
  SpotifyTokens,
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

function isUnit(v: unknown): v is DurationUnit {
  return v === "s" || v === "min" || v === "h";
}

/**
 * Load config with v1→v2 migration:
 * - No localStorage config → brand-new defaults (units = min).
 * - Existing config without configVersion → migrate: units = 's', keep second values.
 */
export function loadConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const raw = localStorage.getItem(STORAGE_KEYS.config);
  if (!raw) return { ...DEFAULT_CONFIG };

  const parsed = safeParse<Partial<AppConfig> & Record<string, unknown>>(
    raw,
    {},
  );
  const themeStored = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;
  const theme: Theme =
    themeStored === "light" || themeStored === "dark"
      ? themeStored
      : parsed.theme === "light" || parsed.theme === "dark"
        ? parsed.theme
        : DEFAULT_CONFIG.theme;

  const isV1 = parsed.configVersion !== CONFIG_VERSION;

  const base: AppConfig = {
    ...DEFAULT_CONFIG,
    focoSeconds:
      typeof parsed.focoSeconds === "number"
        ? parsed.focoSeconds
        : DEFAULT_CONFIG.focoSeconds,
    pausaCurtaSeconds:
      typeof parsed.pausaCurtaSeconds === "number"
        ? parsed.pausaCurtaSeconds
        : DEFAULT_CONFIG.pausaCurtaSeconds,
    pausaLongaSeconds:
      typeof parsed.pausaLongaSeconds === "number"
        ? parsed.pausaLongaSeconds
        : DEFAULT_CONFIG.pausaLongaSeconds,
    soundEnabled:
      typeof parsed.soundEnabled === "boolean"
        ? parsed.soundEnabled
        : DEFAULT_CONFIG.soundEnabled,
    notificationEnabled:
      typeof parsed.notificationEnabled === "boolean"
        ? parsed.notificationEnabled
        : DEFAULT_CONFIG.notificationEnabled,
    theme,
    defaultSessionName:
      typeof parsed.defaultSessionName === "string"
        ? parsed.defaultSessionName
        : DEFAULT_CONFIG.defaultSessionName,
    configVersion: CONFIG_VERSION,
    // Brand-new path never hits here; migration defaults units to seconds.
    focoUnit: isV1
      ? "s"
      : isUnit(parsed.focoUnit)
        ? parsed.focoUnit
        : DEFAULT_CONFIG.focoUnit,
    pausaCurtaUnit: isV1
      ? "s"
      : isUnit(parsed.pausaCurtaUnit)
        ? parsed.pausaCurtaUnit
        : DEFAULT_CONFIG.pausaCurtaUnit,
    pausaLongaUnit: isV1
      ? "s"
      : isUnit(parsed.pausaLongaUnit)
        ? parsed.pausaLongaUnit
        : DEFAULT_CONFIG.pausaLongaUnit,
  };

  return base;
}

export function saveConfig(config: AppConfig): void {
  const toSave: AppConfig = { ...config, configVersion: CONFIG_VERSION };
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(toSave));
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

/* —— Spotify storage —— */

export function loadSpotifyTokens(): SpotifyTokens | null {
  if (typeof window === "undefined") return null;
  const t = safeParse<SpotifyTokens | null>(
    localStorage.getItem(STORAGE_KEYS.spotifyTokens),
    null,
  );
  if (
    !t ||
    typeof t.accessToken !== "string" ||
    typeof t.refreshToken !== "string" ||
    typeof t.expiresAt !== "number"
  ) {
    return null;
  }
  return t;
}

export function saveSpotifyTokens(tokens: SpotifyTokens): void {
  localStorage.setItem(STORAGE_KEYS.spotifyTokens, JSON.stringify(tokens));
}

export function clearSpotifyTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.spotifyTokens);
}

export function loadSpotifyPauseOnFocusEnd(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(STORAGE_KEYS.spotifyPauseOnFocusEnd);
  if (raw === null) return true;
  return raw === "true";
}

export function saveSpotifyPauseOnFocusEnd(value: boolean): void {
  localStorage.setItem(
    STORAGE_KEYS.spotifyPauseOnFocusEnd,
    value ? "true" : "false",
  );
}
