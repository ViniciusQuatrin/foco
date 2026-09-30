# Microcopy — Pomodoro web (pt-BR)
Fonte: brief + IA ux. Tom: cyberpunk/brutalista, contraste alto, tipografia pesada. Zero fofo.
Nome do produto: FOCO.

## CTAs (papéis)
- Primário: Play / Pause
- Secundário: Reset · Histórico · Config
- Terciário: Entrar
- Fim de ciclo: feedback automático (sem CTA extra)

---

## `/` Timer

### Header
- Nome: `FOCO`
- Toggle tema (aria): `Tema claro` / `Tema escuro`
- Entrar (terciário): `Entrar`

### Modo ativo (rótulos)
- `FOCO`
- `PAUSA CURTA`
- `PAUSA LONGA`

### Display
- Tempo: `MM:SS` (sempre com segundos)
- Estado parado: `PARADO`
- Estado rodando: `RODANDO`
- Estado pausado: `PAUSADO`

### Controles
- Play: `INICIAR`
- Pause: `PAUSAR`
- Reset: `ZERAR`
- aria Play: `Iniciar timer`
- aria Pause: `Pausar timer`
- aria Reset: `Zerar timer`

### Nome da sessão
- Label: `SESSÃO`
- Placeholder: `sem nome`
- Vazio ok: mostra `sem nome`

### Nav
- `Histórico`
- `Config`

### Feedback fim de ciclo (auto)
- Foco → pausa: `FOCO FEITO. PAUSA.`
- Pausa curta → foco: `PAUSA CURTA FEITA. DE VOLTA.`
- Pausa longa → foco: `PAUSA LONGA FEITA. DE VOLTA.`

---

## `/config`

### Título
`CONFIG`

### Durações
- Seção: `DURAÇÕES`
- Foco: `Foco` · sufixo `s` (segundos)
- Pausa curta: `Pausa curta` · `s`
- Pausa longa: `Pausa longa` · `s`
- Hint: `Valor em segundos.`

### Som / notificação
- Seção: `ALERTA`
- Som: `Som ao fim`
- Notif: `Notificação ao fim`
- Notif bloqueada: `Notificação bloqueada neste navegador.`

### Tema
- Seção: `TEMA`
- Claro: `Claro`
- Escuro: `Escuro`

### Nome padrão
- Label: `NOME PADRÃO DA SESSÃO`
- Placeholder: `sem nome`

### Nav
- Voltar: `← Timer`

### Erros / validação
- Duração inválida: `Precisa ser um número maior que zero.`
- Salvo (se houver toast): `Config salva.`

---

## `/historico`

### Título
`HISTÓRICO`

### Nota
`Neste aparelho. Sem conta, não sobe pra nuvem.`

### Lista (item)
- Linha: `{nome ou "sem nome"} · {modo} · {duração} · {data/hora local}`
- Modos curtos na lista: `FOCO` / `CURTA` / `LONGA`

### Vazio
Título: `NADA AINDA.`  
Corpo: `Quando um ciclo terminar, aparece aqui.`

### Nav
- Voltar: `← Timer`

---

## `/entrar`

### Título
`ENTRAR`

### Promessa
`Guarda histórico e config além deste aparelho.`

### Form
- E-mail: `E-mail`
- Senha: `Senha`
- Submit: `Entrar`
- Erro genérico: `Não deu. Confere e-mail e senha.`

### Alternativa
`Continuar sem conta` → volta pro Timer (guest)

### Nav / escape
- Voltar: `← Timer`

---

## Chrome global (a11y / meta curto)
- Título doc Timer: `FOCO — Timer`
- Histórico: `FOCO — Histórico`
- Config: `FOCO — Config`
- Entrar: `FOCO — Entrar`
- Skip link: `Ir pro timer`

## O que NÃO escrever (v1)
Sync, ads, paywall, equipe, calendário, Slack, “obrigatório criar conta”, ciclos N focos.

---

# FOCO v2 — delta microcopy
Fonte: brief/IA ux v2. Tom igual (cyberpunk/brutalista). Não muda Timer além do skin.

## `/config` — unidade de duração (substitui hint “Valor em segundos.”)

### Unidade (seletor por campo ou global — conforme UI)
- `s`
- `min`
- `h`
- aria: `Segundos` · `Minutos` · `Horas`

### Campos
- Labels inalterados: `Foco` · `Pausa curta` · `Pausa longa`
- Placeholder valor: `0`
- Hint curta: `Padrão: minutos. Interno: segundos.`
- (Se hint por unidade ativa:)
  - s: `Em segundos.`
  - min: `Em minutos.`
  - h: `Em horas.`

### Validação (além da v1)
- Zero/negativo: `Precisa ser um número maior que zero.` (mantém)
- Unidade sem valor: `Informa um valor.`

## `/config` — Spotify (nova seção)

### Seção
`SPOTIFY`

### Ação
- Desconectado: botão `Conectar Spotify`
- Conectado: `Conectado` · ação secundária `Desconectar`
- Carregando OAuth: `Conectando…`

### Toggle
- Label: `Pausar música quando o foco acabar`
- aria: `Pausar Spotify ao fim do foco`

### Estados / erros
- Desconectado (texto): `Desconectado`
- Conectado (texto): `Conectado`
- Erro genérico OAuth: `Spotify não conectou. Tenta de novo.`
- Erro cancelado pelo user: `Conexão cancelada.`
- Erro sessão/token: `Sessão Spotify expirou. Conecta de novo.`
- Spotify indisponível: `Spotify fora do ar. Tenta mais tarde.`

### Fora do v2 (não escrever)
Playlists · volume · retomar música · reduced-motion copy especial.

---

# FOCO v2 — addendum miniplayer Spotify
Tom cyber, curto. Sem playlists/volume.

## Miniplayer (Timer / chrome quando Spotify conectado)

### Estados
- Nada tocando: `NADA TOCANDO`
- Tocando: mostra `{faixa}` · `{artista}` (se API der; senão `TOCANDO`)
- Erro: `SPOTIFY FALHOU`

### Ações
- Pausar: `PAUSAR` · aria `Pausar faixa`
- Play: `TOCAR` · aria `Tocar faixa`
- Próxima: `PRÓXIMA` · aria `Próxima faixa`

### Erros curtos (miniplayer)
- Genérico: `Não deu pra controlar o Spotify.`
- Sem dispositivo ativo: `Abre o Spotify num aparelho e tenta de novo.`

### Resumo opcional em `/config` (quando conectado)
- Linha: `Miniplayer no timer: play · pausa · próxima`
- Desconectado: (sem linha — só `Conectar Spotify`)
