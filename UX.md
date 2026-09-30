# IA — FOCO / Pomodoro v1 (Next.js App Router)

## Rotas
/ Timer · /historico · /config · /entrar
Sem onboarding. Conta nunca bloqueia uso. Guest default.

## Hierarquia
1. Timer 2. Feedback fim 3. Config 4. Histórico local 5. Login opcional

## `/` Timer — ordem mobile
Header (FOCO + tema + Entrar) → Modo → Display MM:SS + estado → Controles ≥44px → Sessão → Nav Histórico/Config
Essencial sem scroll; timer centro.

## `/config`
Durações (s) · Som/notif · Tema · Nome padrão · Voltar
Sem ciclos N focos. Notif permission só ao ligar opção.

## `/historico`
Lista local · vazio · nota aparelho · Voltar. Sem sync/filtros.

## `/entrar`
Promessa · form · Continuar sem conta → /. Sem sync real v1.

## Tom
Cyberpunk/brutalista, contraste alto, tipo pesada, bordas duras. Claro+escuro fortes.
Espaçamento apertado mobile; sem 100vh vazio.

## a11y
aria Iniciar/Pausar/Zerar; live region em mudanças de estado (não spam/s); foco visível; prefers-reduced-motion; label textual do modo.

---

# IA — FOCO v2 (delta; brief fechado)

Mantém v1: rotas /, /historico, /config, /entrar; guest; timer; som/notif; tema; histórico local; login opcional.

## Design
Cyberpunk 2077: néon, HUD, glitch colorido, animações no relógio. Escuro default; claro contraste alto.
Glitch on por padrão; off com prefers-reduced-motion: reduce. AA+ nos controles (≥44px, foco visível).

## /config — unidade
Por duração (foco / pausa curta / longa): seletor s|min|h + valor; store interno em segundos.
Default usuário novo = minutos; migrar v1 (valores já em segundos) convertendo na UI.
Display timer: MM:SS ou HH:MM:SS quando ≥1h.

## /config — Spotify
OAuth real (PKCE, SPA); estados desconectado/conectado/erro; toggle “pausar música ao fim do foco”.
No fim do foco: se conectado + toggle → pause playback. Sem playlists/volume/retomar.

## Provas
1 Visual cyber + reduced-motion quieto
2 s/min/h sem quebrar timer
3 Spotify pause-on-focus-end

Portfolio case /cases/foco atualizar quando entregável.
