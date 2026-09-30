export type Mode = "foco" | "pausa_curta" | "pausa_longa";
export type TimerStatus = "parado" | "rodando" | "pausado";
export type Theme = "light" | "dark";
export type DurationUnit = "s" | "min" | "h";

export interface AppConfig {
  /** Marker: absence on load = v1 migration (units → 's'). */
  configVersion: number;
  focoSeconds: number;
  pausaCurtaSeconds: number;
  pausaLongaSeconds: number;
  focoUnit: DurationUnit;
  pausaCurtaUnit: DurationUnit;
  pausaLongaUnit: DurationUnit;
  soundEnabled: boolean;
  notificationEnabled: boolean;
  theme: Theme;
  defaultSessionName: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  mode: Mode;
  durationSeconds: number;
  completedAt: string;
}

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/** Brand-new users: units default to minutes; values still stored as seconds. */
export const DEFAULT_CONFIG: AppConfig = {
  configVersion: 2,
  focoSeconds: 1500,
  pausaCurtaSeconds: 300,
  pausaLongaSeconds: 900,
  focoUnit: "min",
  pausaCurtaUnit: "min",
  pausaLongaUnit: "min",
  soundEnabled: true,
  notificationEnabled: false,
  theme: "dark",
  defaultSessionName: "",
};

export const STORAGE_KEYS = {
  config: "foco:config",
  history: "foco:history",
  theme: "foco:theme",
  sessionName: "foco:sessionName",
  spotifyTokens: "foco:spotify:tokens",
  spotifyPauseOnFocusEnd: "foco:spotify:pauseOnFocusEnd",
  spotifyPkce: "foco:spotify:pkce",
} as const;

export const CONFIG_VERSION = 2;
