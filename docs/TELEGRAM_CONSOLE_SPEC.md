# Telegram Console Protocol for OpenClaw Agent Control

This document specifies a **minimal, secure, text-command protocol** for controlling OpenClaw agents via Telegram.

Goals:
- Provide a predictable, low-friction operator console from Telegram.
- Keep the surface area small and auditable.
- Make it hard to accidentally run dangerous actions.

Non-goals:
- This is **not** a public bot.
- This does not define full RBAC, approvals, or multi-tenant permissions.

---

## 1) Security model (minimal but sane)

### 1.1 Allowed operator(s)
- **Allowlist Telegram users by numeric ID**.
- Any command from a non-allowlisted user is ignored (or returns a generic “unauthorized”).

**Config concept:**
- `TELEGRAM_ALLOWED_USER_ID="123"` (single operator)
- Optional multi-operator variant (if you choose to support it): `TELEGRAM_ALLOWED_USER_IDS="123,456"`

### 1.2 Optional shared secret (recommended)
Support a second factor via a shared secret token.

Two modes:
1) **Inline secret:** include a secret in the command itself
   - Example: `/status --secret <token>`
2) **Session unlock:** operator unlocks the console for N minutes
   - `/auth <token>` → “Unlocked for 10 minutes”

**Config concept:**
- `TELEGRAM_SHARED_SECRET="<random-32+ chars>"`
- `TELEGRAM_AUTH_TTL_SECONDS=600`

### 1.3 Rate limiting (required)
- Per-user limit: e.g. **10 commands / minute**.
- Burst: allow small burst (e.g. 3) then enforce.
- On limit hit: respond with “rate limited” and do not execute.

**Config concept:**
- `TELEGRAM_RATE_LIMIT_PER_MINUTE=10`
- `TELEGRAM_RATE_LIMIT_BURST=3`

### 1.4 Redaction & safe output
- Never echo secrets.
- Redact env values for keys matching: `*KEY*`, `*TOKEN*`, `*SECRET*`, `DATABASE_URL`, etc.
- Truncate large outputs by default (with an explicit `--tail` or `--lines`).

### 1.5 Command classes & safety levels
Define command classes to prevent “oops” moments:

- **Safe:** read-only (status, logs, list sessions)
- **Moderate:** actions with clear intent (restart gateway, run cron job)
- **Dangerous:** arbitrary shell, config apply, destructive actions

**Policy:**
- Safe commands require allowlisted user.
- Moderate commands require allowlisted user + (optional) shared secret or unlocked session.
- Dangerous commands require allowlisted user + shared secret and an explicit `--yes` confirmation.

---

## 2) Message formats (Telegram)

All commands are plain text messages starting with `/`.

General format:

```
/<command> [subcommand] [args...] [--flags]
```

Conventions:
- All responses should be **one message** when possible.
- Large outputs should be summarized with an optional follow-up via `/logs --tail 200`.
- Always include a short header line identifying what executed.

---

## 3) Core commands

### 3.1 `/help`
Shows supported commands and brief usage.

**Response:** list commands, examples.

---

### 3.2 `/status`
High-level health check: gateway status, active sessions summary.

**Flags:**
- `--verbose`

**Maps to (OpenClaw CLI / tools):**
- `openclaw status`
- Tool equivalent: `session_status` (for current session), `sessions_list` (summary)

---

### 3.3 `/sessions`
List sessions with filters.

**Flags:**
- `--limit <n>` (default 10)
- `--active-minutes <n>`
- `--kinds <k1,k2>`

**Maps to:**
- Tool: `sessions_list({kinds, limit, activeMinutes})`

---

### 3.4 `/session <sessionKey> <message...>`
Send a message into another session.

**Flags:**
- `--timeout <seconds>` (optional)

**Maps to:**
- Tool: `sessions_send({sessionKey, message, timeoutSeconds})`

---

### 3.5 `/logs`
Show recent logs for gateway/agent runtime.

**Modes:**
- Default: last N lines.

**Flags:**
- `--tail <n>` (default 100)
- `--grep <pattern>` (optional, best-effort)

**Maps to (implementation-dependent):**
- Preferred: a gateway-provided log endpoint or stored log file
- If using CLI: `openclaw gateway status` + system journal integration (if available)

**Note:** This spec defines *interface*. Actual log source depends on deployment.

---

### 3.6 `/gateway status | restart`
Control OpenClaw gateway daemon.

**Maps to:**
- `openclaw gateway status`
- `openclaw gateway restart`
- Tool: `gateway.restart({reason})`

**Safety:** `restart` is **moderate**; require secret/unlock.

---

### 3.7 `/cron list | runs <jobId> | run <jobId>`
Operate cron jobs.

**Maps to:**
- Tool: `cron.list`, `cron.runs`, `cron.run`

**Safety:** `run` is **moderate**.

---

### 3.8 `/agent <label> <cmd> [args...]`
Send a control message to a named agent/session.

**Behavior:** resolve `<label>` to a session key using known mappings (config or a registry).

**Examples:**
- `/agent devops check vercel`
- `/agent research find inspiration marketplaces`

**Maps to:**
- Tool: `sessions_send({label, message})` OR `sessions_send({sessionKey,...})`

**Notes:**
- This is “chat to agent”, not shell.
- Prefer this for most operational tasks instead of `/run`.

---

## 4) Shell execution (high risk)

### 4.1 `/run <shell command...>`
Execute a shell command on the host running OpenClaw.

**Default behavior (safe-by-default):**
- Deny by default unless explicitly enabled.

**Enable flag/config:**
- `TELEGRAM_ALLOW_RUN=false` (default)

**If enabled:**
- Requires allowlisted user + shared secret/unlock + explicit `--yes`.
- Hard output limits (e.g. 8KB) + truncation.
- Timeout required (e.g. 30s default, max 120s).

**Flags:**
- `--timeout <seconds>`
- `--yes` (mandatory)

**Maps to:**
- Host: `exec({command, timeout})`

**Recommended additional guardrails:**
- Optional allowlist of safe prefixes (`git status`, `npm run build`, `openclaw status`, etc.).
- Block destructive patterns by default (`rm -rf`, `curl | sh`, privilege escalation).

---

## 5) Authentication & state (operator UX)

### 5.1 `/auth <token>`
Unlocks moderate commands for a short TTL.

**Response:**
- “Unlocked until <time> UTC”

**State:**
- Store per-user unlock expiry in memory.

### 5.2 `/lock`
Immediately locks the console for that user.

---

## 6) Responses (standardized)

### 6.1 Success

```
OK: <summary>
<optional details...>
```

### 6.2 Error

```
ERROR: <reason>
<optional hint>
```

### 6.3 Unauthorized

```
ERROR: unauthorized
```

(Do not disclose which auth method failed.)

### 6.4 Rate limited

```
ERROR: rate limited (try again later)
```

---

## 7) Examples

### Check status
- `/status`

### Unlock, then restart gateway
- `/auth <token>`
- `/gateway restart`

### Tail logs
- `/logs --tail 200`

### Ask an agent
- `/agent architect summarize current build issues`

### High-risk shell run (only if enabled)
- `/run --yes --timeout 60 npm run build`

---

## 8) Mapping summary (protocol → OpenClaw operations)

| Telegram command | Action | OpenClaw mapping |
|---|---|---|
| `/status` | Health summary | `openclaw status` or `session_status` + `sessions_list` |
| `/sessions` | List sessions | `sessions_list` |
| `/session <key> <msg>` | Send message to session | `sessions_send` |
| `/agent <label> <cmd>` | Send message to labeled agent | `sessions_send(label=...)` |
| `/gateway status` | Gateway status | `openclaw gateway status` |
| `/gateway restart` | Restart gateway | `gateway.restart` or `openclaw gateway restart` |
| `/cron list` | List cron jobs | `cron.list` |
| `/cron run <id>` | Trigger job now | `cron.run` |
| `/logs` | View logs | deployment-specific (prefer gateway log endpoint) |
| `/run ...` | Shell command | `exec` (disabled by default; guarded) |

---

## 9) Implementation notes (for the bot/plugin)

- Parse commands with a minimal tokenizer:
  - command = first token
  - allow `--flag value` pairs and `--flag` booleans
  - preserve remainder for freeform message payloads
- Always validate:
  - user id allowlist
  - secret/unlock requirements by command class
  - rate limits
  - max message length
- Always include correlation info in logs (timestamp, telegram user id, command name, result).
- Prefer executing agent tasks through OpenClaw messaging/session tools; reserve `/run` for emergencies.
