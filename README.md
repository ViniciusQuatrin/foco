# FOCO

Pomodoro web app — cyberpunk/brutalist, pt-BR, local-only.

## Dev

```bash
cd /workspace/pomodoro
npm install
npm run dev
```

Open http://localhost:3000

## Build (static export)

```bash
npm run build
```

Output in `out/`.

## Routes

- `/` Timer
- `/historico` Local history
- `/config` Durations, alerts, theme
- `/entrar` Login UI only (no backend)

## Notes

- Config + history in `localStorage`
- Guest by default; login is optional UI
- Copy from `COPY.md`, UX from `UX.md`
