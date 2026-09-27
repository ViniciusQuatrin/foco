"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { configPage, nav } from "@/content/copy";
import {
  notificationPermission,
  requestNotificationPermission,
} from "@/lib/notifications";
import { AppConfig, Theme } from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { AppHeader } from "./AppHeader";
import { LiveRegion } from "./LiveRegion";

export function ConfigForm() {
  const { config, setConfig, ready } = useTheme();
  const [draft, setDraft] = useState<AppConfig>(config);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [liveMsg, setLiveMsg] = useState("");
  const [notifPerm, setNotifPerm] = useState<
    NotificationPermission | "unsupported"
  >("default");

  useEffect(() => {
    if (ready) setDraft(config);
  }, [ready, config]);

  useEffect(() => {
    setNotifPerm(notificationPermission());
  }, []);

  function validate(c: AppConfig): Record<string, string> {
    const e: Record<string, string> = {};
    if (!(c.focoSeconds > 0)) e.foco = configPage.invalidDuration;
    if (!(c.pausaCurtaSeconds > 0)) e.pausaCurta = configPage.invalidDuration;
    if (!(c.pausaLongaSeconds > 0)) e.pausaLonga = configPage.invalidDuration;
    return e;
  }

  function persist(next: AppConfig) {
    const e = validate(next);
    setErrors(e);
    if (Object.keys(e).length > 0) return false;
    setConfig(next);
    setToast(configPage.saved);
    setLiveMsg(configPage.saved);
    return true;
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    persist(draft);
  }

  async function onToggleSound(checked: boolean) {
    const next = { ...draft, soundEnabled: checked };
    setDraft(next);
    persist(next);
  }

  async function onToggleNotif(checked: boolean) {
    if (checked) {
      const perm = await requestNotificationPermission();
      setNotifPerm(perm);
      if (perm !== "granted") {
        const next = { ...draft, notificationEnabled: false };
        setDraft(next);
        persist(next);
        return;
      }
    }
    const next = { ...draft, notificationEnabled: checked };
    setDraft(next);
    persist(next);
  }

  function onTheme(t: Theme) {
    const next = { ...draft, theme: t };
    setDraft(next);
    persist(next);
  }

  function numField(
    key: "focoSeconds" | "pausaCurtaSeconds" | "pausaLongaSeconds",
    label: string,
    errKey: string,
  ) {
    return (
      <label className="field">
        <span className="field-label">
          {label}{" "}
          <span className="suffix">({configPage.suffix})</span>
        </span>
        <input
          type="number"
          className="input"
          min={1}
          step={1}
          value={draft[key]}
          onChange={(e) =>
            setDraft({
              ...draft,
              [key]: Number(e.target.value),
            })
          }
          onBlur={() => persist(draft)}
        />
        {errors[errKey] ? (
          <span className="field-error">{errors[errKey]}</span>
        ) : null}
      </label>
    );
  }

  const notifBlocked = notifPerm === "denied" || notifPerm === "unsupported";

  return (
    <div className="page">
      <AppHeader />
      <main className="page-body">
        <h1 className="page-title">{configPage.title}</h1>

        <form className="config-form" onSubmit={onSubmit} noValidate>
          <section className="block">
            <h2 className="block-title">{configPage.durations}</h2>
            <p className="hint">{configPage.hint}</p>
            {numField("focoSeconds", configPage.foco, "foco")}
            {numField("pausaCurtaSeconds", configPage.pausaCurta, "pausaCurta")}
            {numField(
              "pausaLongaSeconds",
              configPage.pausaLonga,
              "pausaLonga",
            )}
          </section>

          <section className="block">
            <h2 className="block-title">{configPage.alerta}</h2>
            <label className="toggle-row touch">
              <span>{configPage.sound}</span>
              <input
                type="checkbox"
                checked={draft.soundEnabled}
                onChange={(e) => void onToggleSound(e.target.checked)}
              />
            </label>
            <label className="toggle-row touch">
              <span>{configPage.notif}</span>
              <input
                type="checkbox"
                checked={draft.notificationEnabled}
                disabled={notifBlocked && !draft.notificationEnabled}
                onChange={(e) => void onToggleNotif(e.target.checked)}
              />
            </label>
            {notifBlocked ? (
              <p className="hint warn">{configPage.notifBlocked}</p>
            ) : null}
          </section>

          <section className="block">
            <h2 className="block-title">{configPage.tema}</h2>
            <div className="theme-pills">
              <button
                type="button"
                className={`btn touch ${draft.theme === "light" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => onTheme("light")}
                aria-pressed={draft.theme === "light"}
              >
                {configPage.claro}
              </button>
              <button
                type="button"
                className={`btn touch ${draft.theme === "dark" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => onTheme("dark")}
                aria-pressed={draft.theme === "dark"}
              >
                {configPage.escuro}
              </button>
            </div>
          </section>

          <section className="block">
            <label className="field">
              <span className="field-label">{configPage.defaultName}</span>
              <input
                type="text"
                className="input"
                value={draft.defaultSessionName}
                placeholder={configPage.defaultNamePlaceholder}
                maxLength={80}
                onChange={(e) =>
                  setDraft({ ...draft, defaultSessionName: e.target.value })
                }
                onBlur={() => persist(draft)}
              />
            </label>
          </section>

          <button type="submit" className="sr-only" tabIndex={-1}>
            {configPage.title}
          </button>
        </form>

        {toast ? (
          <p className="toast" role="status">
            {toast}
          </p>
        ) : null}

        <Link href="/" className="btn btn-ghost touch back-link">
          {nav.backTimer}
        </Link>
      </main>
      <LiveRegion message={liveMsg} />
    </div>
  );
}
