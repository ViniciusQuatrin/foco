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
