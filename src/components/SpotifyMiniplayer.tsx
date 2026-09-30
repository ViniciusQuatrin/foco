"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { a11y, spotifyMini } from "@/content/copy";
import {
  fetchSpotifyPlayback,
  isSpotifyConnected,
  SpotifyControlResult,
  SpotifyPlaybackSnapshot,
  spotifyPause,
  spotifyPlay,
  spotifySkipNext,
} from "@/lib/spotify";

const POLL_MS = 5000;
/** Spotify player state lags pause; ignore stale is_playing=true briefly. */
const PAUSE_HOLD_MS = 2500;

type TrackInfo = { trackName: string; artistName: string };

function trackLabel(trackName: string, artistName: string): string {
  const track = trackName.trim();
  const artist = artistName.trim();
  if (track && artist) return `${track} · ${artist}`;
  if (track) return track;
  return spotifyMini.playingFallback;
}

function labelForSnapshot(snap: SpotifyPlaybackSnapshot): string {
  if (snap.kind === "error") return spotifyMini.failed;
  if (snap.kind === "idle") return spotifyMini.idle;
  return trackLabel(snap.trackName, snap.artistName);
}

function pausedSnap(info: TrackInfo): SpotifyPlaybackSnapshot {
  return {
    kind: "track",
    isPlaying: false,
    trackName: info.trackName,
    artistName: info.artistName,
  };
}

function controlErrorMessage(result: SpotifyControlResult): string {
  if (result.ok) return "";
  if (result.reason === "no_device") return spotifyMini.errorNoDevice;
  return spotifyMini.errorGeneric;
}

export function SpotifyMiniplayer() {
  const [visible, setVisible] = useState(false);
  const [snap, setSnap] = useState<SpotifyPlaybackSnapshot>({ kind: "idle" });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const mountedRef = useRef(true);
  const ignorePlayingUntilRef = useRef(0);
  /** Last known track — kept across pause even if Spotify returns 204. */
  const lastTrackRef = useRef<TrackInfo | null>(null);
  /** User hit PAUSAR; keep muted track until play/skip or real new playback. */
  const pausedLocallyRef = useRef(false);

  const rememberTrack = (s: SpotifyPlaybackSnapshot) => {
    if (s.kind === "track") {
      lastTrackRef.current = {
        trackName: s.trackName,
        artistName: s.artistName,
      };
    }
  };

  const refresh = useCallback(async () => {
    if (!isSpotifyConnected()) {
      if (mountedRef.current) setVisible(false);
      return;
    }
    if (mountedRef.current) setVisible(true);
    const next = await fetchSpotifyPlayback();
    if (!mountedRef.current) return;
    if (!isSpotifyConnected()) {
      setVisible(false);
      return;
    }

    rememberTrack(next);

    const holdingPause = Date.now() < ignorePlayingUntilRef.current;
    const wantPaused =
      pausedLocallyRef.current || holdingPause;

    if (wantPaused) {
      if (next.kind === "track" && next.isPlaying && holdingPause) {
        // Stale is_playing=true right after PAUSAR
        setSnap(pausedSnap(next));
        return;
      }
      if (next.kind === "track" && !next.isPlaying) {
        setSnap(pausedSnap(next));
        return;
      }
      if (next.kind === "idle" && lastTrackRef.current) {
        // 204 / empty while user paused — keep gray track label
        setSnap(pausedSnap(lastTrackRef.current));
        return;
      }
      if (next.kind === "track" && next.isPlaying && !holdingPause) {
        // Real resume from another device — clear local pause
        pausedLocallyRef.current = false;
        setSnap(next);
        return;
      }
    }

    if (next.kind === "track" && next.isPlaying) {
      pausedLocallyRef.current = false;
    }
    setSnap(next);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void refresh();

    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_MS);

    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mountedRef.current = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  async function runControl(
    action: () => Promise<SpotifyControlResult>,
    mode: "pause" | "play" | "next",
  ): Promise<void> {
    if (busy) return;
    setBusy(true);
    setActionError("");
    try {
      const result = await action();
      if (!result.ok) {
        setActionError(controlErrorMessage(result));
        if (result.reason === "auth") setVisible(false);
        return;
      }
      if (mode === "pause") {
        pausedLocallyRef.current = true;
        ignorePlayingUntilRef.current = Date.now() + PAUSE_HOLD_MS;
        setSnap((prev) => {
          if (prev.kind === "track") {
            const info = {
              trackName: prev.trackName,
              artistName: prev.artistName,
            };
            lastTrackRef.current = info;
            return pausedSnap(info);
          }
          if (lastTrackRef.current) return pausedSnap(lastTrackRef.current);
          return prev;
        });
        window.setTimeout(() => {
          if (mountedRef.current) void refresh();
        }, PAUSE_HOLD_MS);
        return;
      }
      if (mode === "play") {
        pausedLocallyRef.current = false;
        ignorePlayingUntilRef.current = 0;
      }
      if (mode === "next") {
        // Keep pause flag only if we were paused; refresh will update track
        ignorePlayingUntilRef.current = 0;
      }
      await refresh();
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }

  if (!visible) return null;

  const isPlaying = snap.kind === "track" && snap.isPlaying;
  const controlsDisabled = busy || snap.kind === "error";
  const statusClass =
    snap.kind === "error"
      ? "is-error"
      : isPlaying
        ? "is-playing"
        : "is-idle";
  const label = labelForSnapshot(snap);

  return (
    <aside
      className="spotify-mini"
      aria-label="Spotify"
      data-state={
        isPlaying ? "playing" : snap.kind === "error" ? "error" : "idle"
      }
    >
      <div className={`spotify-mini-meta ${statusClass}`} role="status">
        <span className="spotify-mini-label" key={label}>
          {label}
        </span>
        {actionError ? (
          <span className="spotify-mini-error">{actionError}</span>
        ) : null}
      </div>
      <div className="spotify-mini-controls">
        {isPlaying ? (
          <button
            type="button"
            className="btn btn-secondary touch"
            disabled={controlsDisabled}
            onClick={() => void runControl(spotifyPause, "pause")}
            aria-label={a11y.spotifyPauseTrack}
          >
            {spotifyMini.pause}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary touch"
            disabled={controlsDisabled}
            onClick={() => void runControl(spotifyPlay, "play")}
            aria-label={a11y.spotifyPlayTrack}
          >
            {spotifyMini.play}
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary touch"
          disabled={controlsDisabled}
          onClick={() => void runControl(spotifySkipNext, "next")}
          aria-label={a11y.spotifyNextTrack}
        >
          {spotifyMini.next}
        </button>
      </div>
    </aside>
  );
}
