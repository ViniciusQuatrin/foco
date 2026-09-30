"use client";

import { useCallback, useEffect, useState } from "react";
import { a11y, configPage } from "@/content/copy";
import {
  beginSpotifyAuth,
  disconnectSpotify,
  getSpotifyClientId,
  handleSpotifyCallback,
  isSpotifyConnected,
  SpotifyUiState,
} from "@/lib/spotify";
import {
  loadSpotifyPauseOnFocusEnd,
  saveSpotifyPauseOnFocusEnd,
} from "@/lib/storage";

export function SpotifySection() {
  const [ui, setUi] = useState<SpotifyUiState>("disconnected");
  const [errorMsg, setErrorMsg] = useState("");
  const [pauseOnEnd, setPauseOnEnd] = useState(true);
  const [ready, setReady] = useState(false);

  const refreshConnection = useCallback(() => {
    if (isSpotifyConnected()) {
      setUi("connected");
      setErrorMsg("");
    } else {
      setUi((prev) => (prev === "error" ? "error" : "disconnected"));
    }
  }, []);

  useEffect(() => {
    setPauseOnEnd(loadSpotifyPauseOnFocusEnd());
    refreshConnection();
    setReady(true);
  }, [refreshConnection]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.get("code") && !params.get("error")) return;

    setUi("connecting");
    void (async () => {
      const result = await handleSpotifyCallback(params);
      if (!result) {
        refreshConnection();
        return;
      }
      if (result.ok) {
        setUi("connected");
        setErrorMsg("");
      } else {
        setUi("error");
        setErrorMsg(result.message);
      }
    })();
  }, [ready, refreshConnection]);

  async function onConnect() {
    setErrorMsg("");
    if (!getSpotifyClientId()) {
      setUi("error");
      setErrorMsg(configPage.spotifyErrorGeneric);
      return;
    }
    setUi("connecting");
    try {
      await beginSpotifyAuth();
    } catch {
      setUi("error");
      setErrorMsg(configPage.spotifyErrorGeneric);
    }
  }

  function onDisconnect() {
    disconnectSpotify();
    setUi("disconnected");
    setErrorMsg("");
  }

  function onTogglePause(checked: boolean) {
    setPauseOnEnd(checked);
    saveSpotifyPauseOnFocusEnd(checked);
  }

  const statusText =
    ui === "connected"
      ? configPage.spotifyConnected
      : ui === "connecting"
        ? configPage.spotifyConnecting
        : ui === "error"
          ? errorMsg || configPage.spotifyErrorGeneric
          : configPage.spotifyDisconnected;

  return (
    <section className="block">
      <h2 className="block-title">{configPage.spotify}</h2>

      <div className="spotify-status">
        <span
          className={`spotify-status-text ${
            ui === "connected"
              ? "is-connected"
              : ui === "error"
                ? "is-error"
                : ""
          }`}
          role="status"
        >
          {statusText}
        </span>

        {ui === "connected" ? (
          <button
            type="button"
            className="btn btn-secondary touch"
            onClick={onDisconnect}
          >
            {configPage.spotifyDisconnect}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-accent touch"
            onClick={() => void onConnect()}
            disabled={ui === "connecting"}
          >
            {ui === "connecting"
              ? configPage.spotifyConnecting
              : configPage.spotifyConnect}
          </button>
        )}
      </div>

      <label className="toggle-row touch">
        <span>{configPage.spotifyPauseToggle}</span>
        <input
          type="checkbox"
          checked={pauseOnEnd}
          onChange={(e) => onTogglePause(e.target.checked)}
          aria-label={a11y.spotifyPauseToggle}
        />
      </label>
    </section>
  );
}
