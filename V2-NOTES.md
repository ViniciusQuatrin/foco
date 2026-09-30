# FOCO v2 notes

## What changed

1. **Visual — Cyberpunk 2077**
   - Neon accents, HUD scanlines, colorful glitch on the clock while running.
   - Dark default; high-contrast light theme.
   - Glitch/animations on by default; fully quiet under `prefers-reduced-motion: reduce`.
   - Controls remain AA+ (≥44px, visible focus).

2. **Duration units on `/config`**
   - Per field (foco / pausa curta / longa): selector `s | min | h` + numeric value.
   - Always stored as seconds (`focoSeconds` etc.).
   - Preferred unit persisted (`focoUnit`, `pausaCurtaUnit`, `pausaLongaUnit`).
   - Brand-new users: units default to **minutes** (25 / 5 / 15 → 1500 / 300 / 900 s).
   - v1 migration: config without `configVersion: 2` → units default to **`s`**, values kept as seconds.
   - Timer display: `MM:SS`, or `HH:MM:SS` when total ≥ 3600.

3. **Spotify OAuth (PKCE) + pause on focus end**
   - SPA Authorization Code + PKCE (no client secret).
   - `/config` section: disconnected / connected / connecting / error.
   - Toggle: “Pausar música quando o foco acabar”.
   - On timer `completeCycle` when mode was `foco` + connected + toggle → `PUT /v1/me/player/pause` (404 ignored).
   - Tokens + toggle in `localStorage` under `foco:spotify*`.

## Env

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Spotify app client ID (may be empty at build; connect shows error) |

## Spotify redirect URIs (Dashboard)

Register:

- `https://foco-bzo.pages.dev/config`
- `http://localhost:3000/config`
- Trailing-slash variants if the host normalizes paths: `.../config/`

Redirect used by the app: `${window.location.origin}/config` (matches Next export without `trailingSlash`).

## How to verify (3 provas)

1. **Visual + reduced-motion** — Open `/`, start timer: neon + glitch on display. Enable OS “reduce motion”: glitch/scan stop.
2. **Units** — `/config`: change foco to `1` + `min` → timer shows `01:00`. Switch unit to `s` → display `60`. Set `1` + `h` → timer `01:00:00`. Clear localStorage → new user defaults in minutes.
3. **Spotify** — Set `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`, register redirect URI, Conectar Spotify, enable pause toggle, run a short foco cycle with Spotify playing → music pauses at end.

## UX addendum (post-v2)

1. **/config desktop layout** — From `min-width: 1024px`, wider page (`max-width: 58rem`) and 2-column grid: left = DURAÇÕES, right = Spotify + alerta/tema/nome. Mobile stays compact single column.
2. **Shell border glitch** — Colorful glitch extended to neon HUD frame edges on `.page` (app shell), not only the clock. Default ON; fully quiet under `prefers-reduced-motion: reduce` (no glitch on borders or clock).
3. **Timer viewport centering** — `/` only: `.timer-shell` flex-centers the focus card (H+V) with extra top padding; `min-height: 100dvh` + `safe center` so short screens still scroll (no fixed-100vh holes). Config/Spotify layouts untouched.
4. **Spotify miniplayer** — When connected: compact HUD on `/` (timer) showing now-playing + play/pause + skip next; must not compete with timer Play. Optional summary on `/config`. States: nothing playing / playing / API error. Mobile: low height, targets ≥44px. OUT: playlists, volume UI, auto-resume beyond pause/skip.
