# simple-sdlc

A "software house in a box" skill for AI coding agents. It makes a single AI agent (such as Claude Code or Factory Droid) behave like a disciplined seven-role software team — Product Owner, Software Architect, Backend Engineer, Frontend Engineer, QA Automation, DevOps, and Scrum Master — instead of a lone coder that jumps straight into writing code.

## Concept

AI agents are fast but undisciplined by default: they skip requirements, touch any file, and rarely write tests first. Real software teams stay reliable through **separation of concerns** — each role owns specific artifacts, and work moves through phases with quality gates between them.

This skill encodes that discipline as three rules the agent must follow:

1. **Role adoption** — every task is executed *as* one of the seven roles, and each role may only write to the files it owns (e.g., only the Architect edits `schema.sql`; only QA and Backend touch the test script).
2. **Phase gating** — work flows through six SDLC phases (Inception → Design → Sprint Execution → CI Gates → Review → Release). No production code before an ADR and schema exist; no merge with failing tests.
3. **Escalation rules** — schema or API contract changes require Architect approval recorded as an ADR; incomplete acceptance criteria block the story until the Product Owner updates requirements.

The result is auditable, test-driven output: the agent announces role switches ("As QA, adding row-isolation assertions..."), writes tests before code, and keeps tracking artifacts (`STATUS.md`, `docs/REVIEWS.md`, `CHANGELOG.md`) up to date.

## Repository Structure

This repo is a plugin marketplace containing the `simple-sdlc` plugin:

```
/
├── .factory-plugin/
│   └── marketplace.json          # Marketplace manifest (Factory Droid)
├── package.json                  # npm package for the npx installer
├── bin/
│   └── install.mjs               # npx installer script
└── simple-sdlc/                  # The plugin
    ├── .factory-plugin/
    │   └── plugin.json           # Plugin manifest
    └── skills/simple-sdlc/
        ├── SKILL.md              # The skill — operating protocol (roles, phases, rules)
        ├── job-description.md    # Full role definitions: responsibilities, skills, KPIs
        └── communication.md      # Phase-by-phase pipeline: which files each role reads/writes
```

`SKILL.md` is a lean summary that links to the other two documents as the source of truth.

## The Seven Roles at a Glance

| Role | Owns |
| --- | --- |
| Product Owner | `docs/REQUIREMENTS.md`, `CHANGELOG.md`, version bumps |
| Software Architect | `docs/adr/`, `schema.sql`; approves contract changes |
| Senior Backend Engineer | `worker/src/index.js`, backend test assertions |
| Senior Frontend Engineer | `frontend/src/` (React components, Vanilla CSS) |
| QA & Test Automation | `scripts/test-worker.mjs`, `docs/REVIEWS.md` |
| DevOps & Infra | `.github/workflows/`, `wrangler.toml`, secrets |
| Scrum Master | `STATUS.md` (progress, blockers, retrospectives) |

The reference project is a **Cloudflare Workers + D1 (SQLite) + React/Vite** stack, but the structure adapts to any stack — see [Customization](#customization).

## Installation

### Option A — npx (easiest)

One command, no cloning. Run it inside your project:

```bash
# straight from GitHub (works even before the package is on npm)
npx github:lifetofree/ai-agents

# or, once published to npm
npx simple-sdlc
```

By default this installs the skill into the current project's `.claude/skills/simple-sdlc/`. Flags:

| Flag | Effect |
| --- | --- |
| `--global` / `-g` | Install to `~/.claude/skills/` — available in all your projects |
| `--force` / `-f` | Overwrite an existing installation (e.g., to update) |
| `--help` / `-h` | Show usage |

Then restart your Claude Code session and invoke it with `/simple-sdlc`.

### Option B — Plugin marketplace (Factory Droid)

Once this repo is published to GitHub, add it as a marketplace and install the plugin from inside the droid CLI:

```
/plugin marketplace add lifetofree/ai-agents
/plugin install simple-sdlc
```

### Option C — Manual copy (Claude Code)

Copy the skill folder into your project's `.claude/skills/` directory:

```bash
git clone --depth 1 https://github.com/lifetofree/ai-agents /tmp/ai-agents \
  && mkdir -p .claude/skills \
  && cp -r /tmp/ai-agents/simple-sdlc/skills/simple-sdlc .claude/skills/ \
  && rm -rf /tmp/ai-agents
```

Claude Code discovers skills at `.claude/skills/<name>/SKILL.md` automatically. Use `~/.claude/skills/` instead to install it for all your projects.

### Option D — Any other AI agent (Cursor, Codex, etc.)

The skill is plain Markdown with no agent-specific syntax. Copy `simple-sdlc/skills/simple-sdlc/` into your project and point your agent's rules file at `SKILL.md` — e.g., from `.cursorrules` or `AGENTS.md`.

## Usage

Once installed, invoke it explicitly (`/simple-sdlc` in Claude Code) or just describe work naturally — the agent classifies the task into a phase, adopts the right role, and respects file ownership:

- *"Add a feature to let users export their logs as CSV"* → starts at Phase 1 (PO writes acceptance criteria), not at code.
- *"The ratings endpoint returns 500"* → Backend Engineer diagnoses; QA adds a regression assertion first.
- *"We need to change the entries table"* → Architect role: requires an ADR before `schema.sql` changes.
- *"What's the sprint status?"* → Scrum Master reads and updates `STATUS.md`.

## Customization

The reference constraints (Cloudflare Workers, JWT via `jose`, GMT+7 timezone, 50-user cap, decimal ratings) belong to the original example project. To adapt the skill to your project:

1. Edit **`SKILL.md`** — replace the *Workspace Layout* and *Project Technical Constraints* sections with your stack and rules.
2. Edit **`job-description.md`** — adjust each role's technical skills to your technologies (e.g., swap Cloudflare Workers for AWS Lambda).
3. Edit **`communication.md`** — update the read/write file paths in the phase tables to match your repo layout.

Keep the three invariants (role ownership, phase gating, escalation rules) — they are the point of the skill; everything else is swappable detail.

## Why This Works

A single agent with full write access tends to conflate concerns: it edits the schema while fixing a UI bug, or ships code without tests because nothing stops it. Explicit file ownership and phase gates give the agent the same guardrails that keep human teams honest — and give you an auditable trail (ADRs, `REVIEWS.md`, `STATUS.md`) of *why* every change happened.

## License

[MIT](LICENSE)
