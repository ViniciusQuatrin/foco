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
