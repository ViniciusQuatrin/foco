# FOCO

Pomodoro web app — Cyberpunk 2077 / brutalist, pt-BR, local-only (+ optional Spotify pause).

## Dev

```bash
cd /workspace/pomodoro
npm install
npm run dev
```

Open http://localhost:3000

Optional Spotify (PKCE SPA):

```bash
# .env.local
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

## Build (static export)

```bash
npm run build
```

Output in `out/`. Keep client JS — the timer needs it.

## Routes

- `/` Timer
- `/historico` Local history
- `/config` Durations (s|min|h), Spotify, alerts, theme
- `/entrar` Login UI only (no backend)

## Spotify Dashboard redirect URIs

Register **exact** redirect URIs (no client secret — Authorization Code + PKCE):

- `https://foco-bzo.pages.dev/config`
- `http://localhost:3000/config`
- Also add trailing-slash variants if your host rewrites paths:
  - `https://foco-bzo.pages.dev/config/`
  - `http://localhost:3000/config/`

Env: `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`

Scopes: `user-modify-playback-state`, `user-read-playback-state`

## Notes

- Config + history in `localStorage`
- Guest by default; login is optional UI
- Copy from `COPY.md`, UX from `UX.md`
- See `V2-NOTES.md` for v2 delta
