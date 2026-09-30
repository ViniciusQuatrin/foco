"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { a11y, configPage, nav } from "@/content/copy";
import {
  notificationPermission,
  requestNotificationPermission,
} from "@/lib/notifications";
import { formatUnitInput, unitToSeconds } from "@/lib/units";
import { AppConfig, DurationUnit, Theme } from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { AppHeader } from "./AppHeader";
import { LiveRegion } from "./LiveRegion";
import { SpotifySection } from "./SpotifySection";

type DurationKey = "foco" | "pausaCurta" | "pausaLonga";

const DURATION_MAP: Record<
  DurationKey,
  {
    secondsKey: "focoSeconds" | "pausaCurtaSeconds" | "pausaLongaSeconds";
    unitKey: "focoUnit" | "pausaCurtaUnit" | "pausaLongaUnit";
    label: string;
  }
> = {
  foco: {
    secondsKey: "focoSeconds",
    unitKey: "focoUnit",
    label: configPage.foco,
  },
  pausaCurta: {
    secondsKey: "pausaCurtaSeconds",
    unitKey: "pausaCurtaUnit",
    label: configPage.pausaCurta,
  },
  pausaLonga: {
    secondsKey: "pausaLongaSeconds",
    unitKey: "pausaLongaUnit",
    label: configPage.pausaLonga,
  },
};

const UNITS: DurationUnit[] = ["s", "min", "h"];

const UNIT_ARIA: Record<DurationUnit, string> = {
  s: a11y.unitSeconds,
  min: a11y.unitMinutes,
  h: a11y.unitHours,
};

export function ConfigForm() {
  const { config, setConfig, ready } = useTheme();
  const [draft, setDraft] = useState<AppConfig>(config);
  const [displayValues, setDisplayValues] = useState<Record<DurationKey, string>>(
    {
      foco: formatUnitInput(config.focoSeconds, config.focoUnit),
      pausaCurta: formatUnitInput(
        config.pausaCurtaSeconds,
        config.pausaCurtaUnit,
      ),
      pausaLonga: formatUnitInput(
        config.pausaLongaSeconds,
        config.pausaLongaUnit,
      ),
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [liveMsg, setLiveMsg] = useState("");
  const [notifPerm, setNotifPerm] = useState<
    NotificationPermission | "unsupported"
  >("default");

  useEffect(() => {
    if (!ready) return;
    setDraft(config);
    setDisplayValues({
      foco: formatUnitInput(config.focoSeconds, config.focoUnit),
      pausaCurta: formatUnitInput(
        config.pausaCurtaSeconds,
        config.pausaCurtaUnit,
      ),
      pausaLonga: formatUnitInput(
        config.pausaLongaSeconds,
        config.pausaLongaUnit,
      ),
    });
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

  function applyDurationValue(key: DurationKey, raw: string, unit: DurationUnit) {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "-" || trimmed === ".") {
      setErrors((prev) => ({
        ...prev,
        [key]: configPage.missingValue,
      }));
      return;
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      setErrors((prev) => ({
        ...prev,
        [key]: configPage.invalidDuration,
      }));
      return;
    }
    const seconds = unitToSeconds(num, unit);
    if (!(seconds > 0)) {
      setErrors((prev) => ({
        ...prev,
        [key]: configPage.invalidDuration,
      }));
      return;
    }
    const meta = DURATION_MAP[key];
    const next = {
      ...draft,
      [meta.secondsKey]: seconds,
      [meta.unitKey]: unit,
    } as AppConfig;
    setDraft(next);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    persist(next);
  }

  function onUnitChange(key: DurationKey, unit: DurationUnit) {
    const meta = DURATION_MAP[key];
    const seconds = draft[meta.secondsKey];
    const next = { ...draft, [meta.unitKey]: unit } as AppConfig;
    setDraft(next);
    setDisplayValues((prev) => ({
      ...prev,
      [key]: formatUnitInput(seconds, unit),
    }));
    persist(next);
  }

  function durationField(key: DurationKey) {
    const meta = DURATION_MAP[key];
    const unit = draft[meta.unitKey];
    return (
      <div className="duration-field">
        <span className="field-label" id={`label-${key}`}>
          {meta.label}
        </span>
        <div className="duration-row">
          <input
            type="number"
            className="input"
            min={0}
            step="any"
            inputMode="decimal"
            placeholder={configPage.valuePlaceholder}
            value={displayValues[key]}
            aria-labelledby={`label-${key}`}
            onChange={(e) =>
              setDisplayValues((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            onBlur={() =>
              applyDurationValue(key, displayValues[key], unit)
            }
          />
          <div className="unit-pills" role="group">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                className={`btn btn-unit touch ${unit === u ? "btn-primary" : "btn-secondary"}`}
                aria-label={UNIT_ARIA[u]}
                aria-pressed={unit === u}
                onClick={() => onUnitChange(key, u)}
              >
                {configPage.unit[u]}
              </button>
            ))}
          </div>
        </div>
        <p className="hint">{configPage.hintUnit[unit]}</p>
        {errors[key] ? (
          <span className="field-error">{errors[key]}</span>
        ) : null}
      </div>
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
            {durationField("foco")}
            {durationField("pausaCurta")}
            {durationField("pausaLonga")}
          </section>

          <SpotifySection />

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
