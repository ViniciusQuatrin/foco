export type Mode = "foco" | "pausa_curta" | "pausa_longa";
export type TimerStatus = "parado" | "rodando" | "pausado";
export type Theme = "light" | "dark";

export interface AppConfig {
  focoSeconds: number;
  pausaCurtaSeconds: number;
  pausaLongaSeconds: number;
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

export const DEFAULT_CONFIG: AppConfig = {
  focoSeconds: 1500,
  pausaCurtaSeconds: 300,
  pausaLongaSeconds: 900,
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
} as const;
