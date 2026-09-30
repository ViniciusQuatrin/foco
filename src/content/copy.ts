/** Typed UI strings from COPY.md — do not invent copy. */

export const product = {
  name: "FOCO",
} as const;

export const docs = {
  timer: "FOCO — Timer",
  historico: "FOCO — Histórico",
  config: "FOCO — Config",
  entrar: "FOCO — Entrar",
} as const;

export const a11y = {
  skipLink: "Ir pro timer",
  themeLight: "Tema claro",
  themeDark: "Tema escuro",
  play: "Iniciar timer",
  pause: "Pausar timer",
  reset: "Zerar timer",
  unitSeconds: "Segundos",
  unitMinutes: "Minutos",
  unitHours: "Horas",
  spotifyPauseToggle: "Pausar Spotify ao fim do foco",
  spotifyPlayTrack: "Tocar faixa",
  spotifyPauseTrack: "Pausar faixa",
  spotifyNextTrack: "Próxima faixa",
} as const;

export const modes = {
  foco: "FOCO",
  pausa_curta: "PAUSA CURTA",
  pausa_longa: "PAUSA LONGA",
} as const;

export const modesShort = {
  foco: "FOCO",
  pausa_curta: "CURTA",
  pausa_longa: "LONGA",
} as const;

export const status = {
  parado: "PARADO",
  rodando: "RODANDO",
  pausado: "PAUSADO",
} as const;

export const controls = {
  play: "INICIAR",
  pause: "PAUSAR",
  reset: "ZERAR",
} as const;

export const session = {
  label: "SESSÃO",
  placeholder: "sem nome",
  empty: "sem nome",
} as const;

export const nav = {
  historico: "Histórico",
  config: "Config",
  entrar: "Entrar",
  backTimer: "← Timer",
  continueGuest: "Continuar sem conta",
} as const;

export const feedback = {
  focoDone: "FOCO FEITO. PAUSA.",
  pausaCurtaDone: "PAUSA CURTA FEITA. DE VOLTA.",
  pausaLongaDone: "PAUSA LONGA FEITA. DE VOLTA.",
} as const;

export const configPage = {
  title: "CONFIG",
  durations: "DURAÇÕES",
  foco: "Foco",
  pausaCurta: "Pausa curta",
  pausaLonga: "Pausa longa",
  /** @deprecated v1 suffix — kept for reference; v2 uses unit selector */
  suffix: "s",
  hint: "Padrão: minutos. Interno: segundos.",
  hintUnit: {
    s: "Em segundos.",
    min: "Em minutos.",
    h: "Em horas.",
  },
  unit: {
    s: "s",
    min: "min",
    h: "h",
  },
  valuePlaceholder: "0",
  missingValue: "Informa um valor.",
  alerta: "ALERTA",
  sound: "Som ao fim",
  notif: "Notificação ao fim",
  notifBlocked: "Notificação bloqueada neste navegador.",
  tema: "TEMA",
  claro: "Claro",
  escuro: "Escuro",
  defaultName: "NOME PADRÃO DA SESSÃO",
  defaultNamePlaceholder: "sem nome",
  invalidDuration: "Precisa ser um número maior que zero.",
  saved: "Config salva.",
  spotify: "SPOTIFY",
  spotifyConnect: "Conectar Spotify",
  spotifyDisconnect: "Desconectar",
  spotifyConnecting: "Conectando…",
  spotifyConnected: "Conectado",
  spotifyDisconnected: "Desconectado",
  spotifyPauseToggle: "Pausar música quando o foco acabar",
  spotifyMiniplayerHint: "Miniplayer no timer: play · pausa · próxima",
  spotifyErrorGeneric: "Spotify não conectou. Tenta de novo.",
  spotifyErrorCancelled: "Conexão cancelada.",
  spotifyErrorSession: "Sessão Spotify expirou. Conecta de novo.",
  spotifyErrorUnavailable: "Spotify fora do ar. Tenta mais tarde.",
} as const;

export const historicoPage = {
  title: "HISTÓRICO",
  note: "Neste aparelho. Sem conta, não sobe pra nuvem.",
  emptyTitle: "NADA AINDA.",
  emptyBody: "Quando um ciclo terminar, aparece aqui.",
} as const;

export const entrarPage = {
  title: "ENTRAR",
  promise: "Guarda histórico e config além deste aparelho.",
  email: "E-mail",
  password: "Senha",
  submit: "Entrar",
  error: "Não deu. Confere e-mail e senha.",
} as const;

export const spotifyMini = {
  idle: "NADA TOCANDO",
  playingFallback: "TOCANDO",
  failed: "SPOTIFY FALHOU",
  play: "TOCAR",
  pause: "PAUSAR",
  next: "PRÓXIMA",
  errorGeneric: "Não deu pra controlar o Spotify.",
  errorNoDevice: "Abre o Spotify num aparelho e tenta de novo.",
} as const;
