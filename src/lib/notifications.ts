"use client";

import { Mode } from "./types";
import { feedback, modes, product } from "@/content/copy";

export function notificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationSupported()) return "unsupported";
  return Notification.permission;
}

/** Request permission only when user enables the toggle — never on first paint. */
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!notificationSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function notifyCycleEnd(mode: Mode): void {
  if (!notificationSupported()) return;
  if (Notification.permission !== "granted") return;
  const body =
    mode === "foco"
      ? feedback.focoDone
      : mode === "pausa_curta"
        ? feedback.pausaCurtaDone
        : feedback.pausaLongaDone;
  try {
    new Notification(product.name, {
      body: `${modes[mode]} — ${body}`,
      silent: true,
    });
  } catch {
    // ignore
  }
}
