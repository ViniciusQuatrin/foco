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

function labelForSnapshot(snap: SpotifyPlaybackSnapshot): string {
  if (snap.kind === "idle") return spotifyMini.idle;
  if (snap.kind === "error") return spotifyMini.failed;
  const track = snap.trackName.trim();
  const artist = snap.artistName.trim();
  if (track && artist) return `${track} · ${artist}`;
  if (track) return track;
  return spotifyMini.playingFallback;
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
  ): Promise<void> {
    if (busy) return;
    setBusy(true);
    setActionError("");
    try {
      const result = await action();
      if (!result.ok) {
        setActionError(controlErrorMessage(result));
        if (result.reason === "auth") setVisible(false);
      } else {
        await refresh();
      }
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
      : snap.kind === "track" && snap.isPlaying
        ? "is-playing"
        : "is-idle";

  return (
    <aside
      className="spotify-mini"
      aria-label="Spotify"
      data-state={snap.kind}
    >
      <div className={`spotify-mini-meta ${statusClass}`} role="status">
        <span className="spotify-mini-label">{labelForSnapshot(snap)}</span>
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
            onClick={() => void runControl(spotifyPause)}
            aria-label={a11y.spotifyPauseTrack}
          >
            {spotifyMini.pause}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary touch"
            disabled={controlsDisabled}
            onClick={() => void runControl(spotifyPlay)}
            aria-label={a11y.spotifyPlayTrack}
          >
            {spotifyMini.play}
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary touch"
          disabled={controlsDisabled}
          onClick={() => void runControl(spotifySkipNext)}
          aria-label={a11y.spotifyNextTrack}
        >
          {spotifyMini.next}
        </button>
      </div>
    </aside>
  );
}
