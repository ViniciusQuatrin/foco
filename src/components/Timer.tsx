"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  a11y,
  controls,
  modes,
  nav,
  session as sessionCopy,
  status as statusCopy,
} from "@/content/copy";
import {
  durationForMode,
  endFeedback,
  formatMMSS,
  nextMode,
} from "@/lib/format";
import { addHistoryItem } from "@/lib/storage";
import { playEndBeep } from "@/lib/sound";
import { notifyCycleEnd } from "@/lib/notifications";
import { HistoryItem, Mode, TimerStatus } from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { AppHeader } from "./AppHeader";
import { LiveRegion } from "./LiveRegion";

export function Timer() {
  const { config, ready } = useTheme();
  const [mode, setMode] = useState<Mode>("foco");
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("parado");
  const [remaining, setRemaining] = useState(config.focoSeconds);
  const [sessionName, setSessionName] = useState("");
  const [endMsg, setEndMsg] = useState("");
  const [liveMsg, setLiveMsg] = useState("");

  const statusRef = useRef(timerStatus);
  const remainingRef = useRef(remaining);
  const modeRef = useRef(mode);
  const configRef = useRef(config);
  const sessionNameRef = useRef(sessionName);
  const endAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  statusRef.current = timerStatus;
  remainingRef.current = remaining;
  modeRef.current = mode;
  configRef.current = config;
  sessionNameRef.current = sessionName;

  // Sync duration when config/mode changes while stopped
  useEffect(() => {
    if (!ready) return;
    if (timerStatus === "parado") {
      setRemaining(durationForMode(mode, config));
    }
  }, [config, mode, ready, timerStatus]);

  // Seed session name from default once ready
  useEffect(() => {
    if (!ready) return;
    setSessionName((prev) =>
      prev === "" && config.defaultSessionName
        ? config.defaultSessionName
        : prev,
    );
  }, [ready, config.defaultSessionName]);

  const announce = useCallback((msg: string) => {
    setLiveMsg("");
    // force live region update
    requestAnimationFrame(() => setLiveMsg(msg));
  }, []);

  const clearTick = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const completeCycle = useCallback(() => {
    clearTick();
    endAtRef.current = null;

    const doneMode = modeRef.current;
    const cfg = configRef.current;
    const duration = durationForMode(doneMode, cfg);
    const name = sessionNameRef.current.trim();
    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      mode: doneMode,
      durationSeconds: duration,
      completedAt: new Date().toISOString(),
    };
    addHistoryItem(item);

    const msg = endFeedback(doneMode);
    setEndMsg(msg);
    announce(`${modes[doneMode]}. ${statusCopy.parado}. ${msg}`);

    if (cfg.soundEnabled) playEndBeep();
    if (cfg.notificationEnabled) notifyCycleEnd(doneMode);

    const nxt = nextMode(doneMode);
    setMode(nxt);
    setTimerStatus("parado");
    setRemaining(durationForMode(nxt, cfg));
  }, [announce, clearTick]);

  const tick = useCallback(() => {
    if (statusRef.current !== "rodando" || endAtRef.current == null) return;
    const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
    setRemaining(left);
    remainingRef.current = left;
    if (left <= 0) {
      completeCycle();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [completeCycle]);

  const start = useCallback(() => {
    const left = remainingRef.current;
    if (left <= 0) return;
    endAtRef.current = Date.now() + left * 1000;
    setTimerStatus("rodando");
    setEndMsg("");
    announce(`${modes[modeRef.current]}. ${statusCopy.rodando}`);
    clearTick();
    rafRef.current = requestAnimationFrame(tick);
  }, [announce, clearTick, tick]);

  const pause = useCallback(() => {
    if (endAtRef.current != null) {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      remainingRef.current = left;
    }
    endAtRef.current = null;
    clearTick();
    setTimerStatus("pausado");
    announce(`${modes[modeRef.current]}. ${statusCopy.pausado}`);
  }, [announce, clearTick]);

  const reset = useCallback(() => {
    clearTick();
    endAtRef.current = null;
    const dur = durationForMode(modeRef.current, configRef.current);
    setRemaining(dur);
    remainingRef.current = dur;
    setTimerStatus("parado");
    setEndMsg("");
    announce(`${modes[modeRef.current]}. ${statusCopy.parado}`);
  }, [announce, clearTick]);

  useEffect(() => () => clearTick(), [clearTick]);

  // Visibility: recalculate remaining when tab becomes visible
  useEffect(() => {
    const onVis = () => {
      if (
        document.visibilityState === "visible" &&
        statusRef.current === "rodando" &&
        endAtRef.current != null
      ) {
        const left = Math.max(
          0,
          Math.ceil((endAtRef.current - Date.now()) / 1000),
        );
        setRemaining(left);
        if (left <= 0) completeCycle();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [completeCycle]);

  const cycleMode = useCallback(() => {
    if (statusRef.current === "rodando") return;
    clearTick();
    endAtRef.current = null;
    const order: Mode[] = ["foco", "pausa_curta", "pausa_longa"];
    const idx = order.indexOf(modeRef.current);
    const nxt = order[(idx + 1) % order.length];
    setMode(nxt);
    const dur = durationForMode(nxt, configRef.current);
    setRemaining(dur);
    remainingRef.current = dur;
    setTimerStatus("parado");
    setEndMsg("");
    announce(`${modes[nxt]}. ${statusCopy.parado}`);
  }, [announce, clearTick]);

  const isRunning = timerStatus === "rodando";
  const canCycleMode = timerStatus !== "rodando";

  return (
    <div className="page page-timer">
      <AppHeader />
      <main id="timer" className="timer-main" tabIndex={-1}>
        <button
          type="button"
          className="mode-label"
          aria-label={modes[mode]}
          onClick={cycleMode}
          disabled={!canCycleMode}
        >
          {modes[mode]}
        </button>

        <div className="timer-display" aria-hidden={false}>
          <div className="time" aria-label={formatMMSS(remaining)}>
            {formatMMSS(remaining)}
          </div>
          <div className="timer-status">{statusCopy[timerStatus]}</div>
        </div>

        {endMsg ? (
          <p className="end-feedback" role="status">
            {endMsg}
          </p>
        ) : null}

        <div className="controls">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-primary touch"
              onClick={pause}
              aria-label={a11y.pause}
            >
              {controls.pause}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary touch"
              onClick={start}
              aria-label={a11y.play}
              disabled={remaining <= 0}
            >
              {controls.play}
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary touch"
            onClick={reset}
            aria-label={a11y.reset}
          >
            {controls.reset}
          </button>
        </div>

        <label className="session-field">
          <span className="field-label">{sessionCopy.label}</span>
          <input
            type="text"
            className="input"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder={sessionCopy.placeholder}
            maxLength={80}
          />
        </label>

        <nav className="timer-nav" aria-label="Secundária">
          <Link href="/historico" className="btn btn-secondary touch">
            {nav.historico}
          </Link>
          <Link href="/config" className="btn btn-secondary touch">
            {nav.config}
          </Link>
        </nav>
      </main>
      <LiveRegion message={liveMsg} />
    </div>
  );
}
