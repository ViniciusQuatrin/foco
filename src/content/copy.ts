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
  suffix: "s",
  hint: "Valor em segundos.",
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
