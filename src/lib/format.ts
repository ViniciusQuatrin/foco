import { Mode } from "./types";
import { feedback, modesShort, session } from "@/content/copy";

/** MM:SS, or HH:MM:SS when total ≥ 3600. */
export function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatDurationShort(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  if (s < 60) return `${s}s`;
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (m === 0 && r === 0) return `${h}h`;
    if (r === 0) return `${h}h ${m}min`;
    return `${h}h ${m}min ${r}s`;
  }
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m}min` : `${m}min ${r}s`;
}

export function formatLocalDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function sessionDisplayName(name: string): string {
  const t = name.trim();
  return t.length > 0 ? t : session.empty;
}

export function historyLine(
  name: string,
  mode: Mode,
  durationSeconds: number,
  completedAt: string,
): string {
  return `${sessionDisplayName(name)} · ${modesShort[mode]} · ${formatDurationShort(durationSeconds)} · ${formatLocalDateTime(completedAt)}`;
}

export function nextMode(mode: Mode): Mode {
  if (mode === "foco") return "pausa_curta";
  return "foco";
}

export function endFeedback(mode: Mode): string {
  if (mode === "foco") return feedback.focoDone;
  if (mode === "pausa_curta") return feedback.pausaCurtaDone;
  return feedback.pausaLongaDone;
}

export function durationForMode(
  mode: Mode,
  config: {
    focoSeconds: number;
    pausaCurtaSeconds: number;
    pausaLongaSeconds: number;
  },
): number {
  if (mode === "foco") return config.focoSeconds;
  if (mode === "pausa_curta") return config.pausaCurtaSeconds;
  return config.pausaLongaSeconds;
}
