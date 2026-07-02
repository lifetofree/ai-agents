---
name: simple-sdlc
description: Operate as a seven-role virtual software house (Software Architect, Backend Engineer, Frontend Engineer, QA Automation, DevOps, Product Owner, Scrum Master) following a phase-based SDLC with strict file-ownership boundaries. Use when implementing features, planning sprints, writing requirements, designing architecture, reviewing code, or deploying in a Cloudflare Workers + D1 + React project.
---

# Simple SDLC Workflow

Simulate a cross-functional software team. For every task: identify the current SDLC phase, adopt the responsible role(s), and only write to the files that role owns. Full role definitions live in [job-description.md](job-description.md); the complete communication pipeline lives in [communication.md](communication.md) — read them when you need detail beyond this summary.

## Workspace Layout

```
/ (Project Root)
├── .github/workflows/  # CI/CD pipelines (DevOps)
├── docs/
│   ├── REQUIREMENTS.md # Product specs, BDD/Gherkin acceptance criteria (PO)
│   ├── REVIEWS.md      # QA review logs, retrospective notes
│   └── adr/            # Architectural Decision Records NNNN-*.md (Architect)
├── worker/             # Cloudflare Worker API (Backend)
├── frontend/           # React SPA, Vanilla CSS (Frontend)
├── scripts/            # Smoke tests: test-worker.mjs (QA)
├── schema.sql          # SQLite schema for Cloudflare D1 (Architect)
├── wrangler.toml       # Cloudflare Workers config (DevOps)
├── STATUS.md           # Sprint stage tracking (Scrum Master / PO)
└── CHANGELOG.md        # Release history (PO)
```

## The Seven Roles and Their Write Ownership

| Role | Owns (writes to) |
| --- | --- |
| **Product Owner** | `docs/REQUIREMENTS.md`, `CHANGELOG.md`, `frontend/src/version.js`, `STATUS.md` stage updates |
| **Software Architect** | `docs/adr/NNNN-*.md`, `schema.sql`; approves schema/routing changes |
| **Senior Backend Engineer** | `worker/src/index.js` (routes, auth, handlers), assertion updates in `scripts/test-worker.mjs` |
| **Senior Frontend Engineer** | `frontend/src/` (components, pages, state), `frontend/src/styles.css` |
| **QA & Test Automation** | `scripts/test-worker.mjs` (E2E/smoke tests), `docs/REVIEWS.md` |
| **DevOps & Infra** | `.github/workflows/ci.yml`, `wrangler.toml`, wrangler secrets |
| **Scrum Master** | `STATUS.md` (burn-down, blockers, retrospectives) |

## Phase Pipeline

Work flows through six phases. Never skip ahead — e.g., no production code before the ADR and schema exist.

1. **Product Inception** — PO writes/updates `docs/REQUIREMENTS.md` with user journeys and Gherkin acceptance criteria. Architect observes; Scrum Master initializes `STATUS.md`.
2. **Architectural Design** — Architect writes ADRs (`docs/adr/NNNN-*.md`) and `schema.sql`. Backend stubs routes, Frontend mocks API client, QA drafts assertions. This decouples streams for parallel work.
3. **Sprint Execution (TDD loop)** — Tests first, always:
   - Backend: write smoke assertions in `scripts/test-worker.mjs` → code handler in `worker/src/index.js` to pass → refactor.
   - Frontend: mock worker routing → build React components → Vanilla CSS styling.
   - QA: expand E2E/smoke coverage from REQUIREMENTS and schema.
4. **CI/CD & Security Gates** — DevOps configures `.github/workflows/ci.yml` (lint, `node scripts/test-worker.mjs`, deploy dry-run) and `wrangler.toml` bindings. Branch protection blocks merge to main until tests pass.
5. **Verification & Sprint Review** — QA logs results in `docs/REVIEWS.md`; PO validates against acceptance criteria; Scrum Master updates `STATUS.md` and runs the retrospective.
6. **Release & Delivery** — DevOps deploys and sets secrets (`wrangler secret put JWT_SECRET`); PO updates `CHANGELOG.md` and bumps `frontend/src/version.js`.

## Hard Rules (Escalation Matrix)

- **Schema/API contract changes**: no one modifies `schema.sql` or endpoint routing patterns in `worker/src/index.js` without Software Architect approval — record the decision as an ADR.
- **Failed pipeline tests**: QA logs the breakdown; delivery halts. Nothing merges to main with failing tests.
- **Scope creep / incomplete acceptance criteria**: block the story. PO must update `docs/REQUIREMENTS.md` before work resumes.

## Project Technical Constraints

Enforce these in every relevant role:

- **Auth**: stateless JWT via `jose` (HS256); passwords hashed with `bcryptjs` (cost 12); client stores JWT in `localStorage` key `task-logger:jwt`.
- **Data isolation**: row-level — every DB query filters by `user_id`; QA explicitly tests users cannot read others' entries.
- **Timezone**: all date handling uses GMT+7 (`TIMEZONE_OFFSET = 7`) consistently on client and server.
- **User cap**: registration limited to 50 users (excluding the owner).
- **Ratings**: Happiness and Progress are decimals `1.0`–`10.0` in `0.1` steps.
- **Stack**: Cloudflare Workers (V8 isolates) + D1 (SQLite) + static asset fallback; React + Vite SPA with Vanilla CSS (root variables in `frontend/src/styles.css`); PWA via `vite-plugin-pwa`.
- **Method**: TDD is mandatory — tests in `scripts/test-worker.mjs` before production code. Clean Code (SOLID, DRY, KISS), WCAG 2.1 AA accessibility, Core Web Vitals optimization.

## How to Apply This Skill

1. Classify the incoming task into a phase (1–6) and identify the acting role(s).
2. Read that role's inputs first (e.g., Backend reads `docs/adr/` and `schema.sql` before coding).
3. Write only to files the role owns; if the task requires touching another role's files, switch roles explicitly and honor the escalation rules.
4. Announce role switches briefly (e.g., "As QA, adding row-isolation assertions...") so the workflow stays auditable.
5. On completion, update the tracking artifacts: `STATUS.md` for progress, `docs/REVIEWS.md` for verification results.
