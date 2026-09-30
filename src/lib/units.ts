import { DurationUnit } from "./types";

export function unitToSeconds(value: number, unit: DurationUnit): number {
  if (unit === "min") return Math.round(value * 60);
  if (unit === "h") return Math.round(value * 3600);
  return Math.round(value);
}

export function secondsToUnit(seconds: number, unit: DurationUnit): number {
  if (unit === "min") return seconds / 60;
  if (unit === "h") return seconds / 3600;
  return seconds;
}

/** Display value for the unit input — keep integers when clean, else up to 2 decimals. */
export function formatUnitInput(seconds: number, unit: DurationUnit): string {
  const v = secondsToUnit(seconds, unit);
  if (!Number.isFinite(v)) return "";
  if (Number.isInteger(v)) return String(v);
  const rounded = Math.round(v * 100) / 100;
  return String(rounded);
}
