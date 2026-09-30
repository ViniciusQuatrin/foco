"use client";

import { configPage } from "@/content/copy";
import {
  clearSpotifyTokens,
  loadSpotifyPauseOnFocusEnd,
  loadSpotifyTokens,
  saveSpotifyTokens,
} from "./storage";
import { SpotifyTokens, STORAGE_KEYS } from "./types";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const PAUSE_URL = "https://api.spotify.com/v1/me/player/pause";
const SCOPES = ["user-modify-playback-state", "user-read-playback-state"].join(
  " ",
);

export type SpotifyUiState =
  | "disconnected"
  | "connected"
  | "connecting"
  | "error";

export function getSpotifyClientId(): string {
  return (process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "").trim();
}

export function getSpotifyRedirectUri(): string {
  if (typeof window === "undefined") return "";
  // Match Next export path without trailingSlash (next.config has none).
  return `${window.location.origin}/config`;
}

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]!);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[arr[i]! % chars.length];
  return out;
}

async function sha256Base64Url(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufferToBase64Url(digest);
}

interface PkcePending {
  verifier: string;
  state: string;
}

function savePkce(p: PkcePending): void {
  sessionStorage.setItem(STORAGE_KEYS.spotifyPkce, JSON.stringify(p));
}

function loadPkce(): PkcePending | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.spotifyPkce);
    if (!raw) return null;
    const p = JSON.parse(raw) as PkcePending;
    if (typeof p.verifier !== "string" || typeof p.state !== "string")
      return null;
    return p;
  } catch {
    return null;
  }
}

function clearPkce(): void {
  sessionStorage.removeItem(STORAGE_KEYS.spotifyPkce);
}

/** Start Authorization Code + PKCE flow. Throws if no client id. */
export async function beginSpotifyAuth(): Promise<void> {
  const clientId = getSpotifyClientId();
  if (!clientId) {
    throw new Error("NO_CLIENT_ID");
  }
  const verifier = randomString(64);
  const challenge = await sha256Base64Url(verifier);
  const state = randomString(32);
  savePkce({ verifier, state });

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getSpotifyRedirectUri(),
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

export type OAuthCallbackResult =
  | { ok: true }
  | { ok: false; message: string };

/** Handle ?code=&state= or ?error= on /config. Cleans the URL afterward. */
export async function handleSpotifyCallback(
  search: URLSearchParams,
): Promise<OAuthCallbackResult | null> {
  const err = search.get("error");
  const code = search.get("code");
  const state = search.get("state");
  if (!err && !code) return null;

  const cleanUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("error");
    window.history.replaceState({}, "", url.pathname + url.hash);
  };

  if (err) {
    clearPkce();
    cleanUrl();
    if (err === "access_denied") {
      return { ok: false, message: configPage.spotifyErrorCancelled };
    }
    return { ok: false, message: configPage.spotifyErrorGeneric };
  }

  const pending = loadPkce();
  clearPkce();
  if (!pending || !code || state !== pending.state) {
    cleanUrl();
    return { ok: false, message: configPage.spotifyErrorGeneric };
  }

  const clientId = getSpotifyClientId();
  if (!clientId) {
    cleanUrl();
    return { ok: false, message: configPage.spotifyErrorGeneric };
  }

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: getSpotifyRedirectUri(),
      code_verifier: pending.verifier,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      cleanUrl();
      if (res.status >= 500) {
        return { ok: false, message: configPage.spotifyErrorUnavailable };
      }
      return { ok: false, message: configPage.spotifyErrorGeneric };
    }
    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };
    const prev = loadSpotifyTokens();
    const tokens: SpotifyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? prev?.refreshToken ?? "",
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    if (!tokens.refreshToken) {
      cleanUrl();
      return { ok: false, message: configPage.spotifyErrorGeneric };
    }
    saveSpotifyTokens(tokens);
    cleanUrl();
    return { ok: true };
  } catch {
    cleanUrl();
    return { ok: false, message: configPage.spotifyErrorUnavailable };
  }
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<SpotifyTokens | null> {
  const clientId = getSpotifyClientId();
  if (!clientId) return null;
  try {
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      if (res.status === 400 || res.status === 401) {
        clearSpotifyTokens();
      }
      return null;
    }
    const data = (await res.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };
    const tokens: SpotifyTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    saveSpotifyTokens(tokens);
    return tokens;
  } catch {
    return null;
  }
}

async function getValidAccessToken(): Promise<string | null> {
  let tokens = loadSpotifyTokens();
  if (!tokens) return null;
  // Refresh 60s early
  if (Date.now() >= tokens.expiresAt - 60_000) {
    tokens = await refreshAccessToken(tokens.refreshToken);
    if (!tokens) return null;
  }
  return tokens.accessToken;
}

export function isSpotifyConnected(): boolean {
  return loadSpotifyTokens() != null;
}

export function disconnectSpotify(): void {
  clearSpotifyTokens();
}

/**
 * Pause Spotify playback if connected + toggle on.
 * Ignores 404 (no active device). Clears tokens on 401 after refresh fail.
 */
export async function pauseSpotifyIfNeeded(): Promise<void> {
  if (!loadSpotifyPauseOnFocusEnd()) return;
  if (!loadSpotifyTokens()) return;

  const access = await getValidAccessToken();
  if (!access) return;

  try {
    const res = await fetch(PAUSE_URL, {
      method: "PUT",
      headers: { Authorization: `Bearer ${access}` },
    });
    // 404 = no active device — ignore per brief
    if (res.status === 404 || res.status === 204 || res.ok) return;
    if (res.status === 401) {
      clearSpotifyTokens();
    }
  } catch {
    // network — ignore; timer must not break
  }
}
