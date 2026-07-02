# Cross-Functional Communication Process & File Lifecycle

This document defines the end-to-end communication model and operational pipeline for our software house. It maps the collaboration of our seven core roles throughout the software development lifecycle (SDLC), specifying exactly which directories, documents, and configuration files each role **reads from** and **writes to**.

## Workspace Directory Structure

To maintain clean codebases and clear separation of concerns, our projects follow a standardized directory structure. The communication process below refers to these specific paths:

/ (Project Root)
├── .github/workflows/  # CI/CD pipelines
├── docs/               # Requirements, reviews, status documents
│   └── adr/            # Architectural Decision Records (ADRs)
├── worker/             # Cloudflare Worker codebase (API routes + static assets fallback)
├── frontend/           # Client-side React user interface (SPA, Vanilla CSS)
├── scripts/            # Smoke tests and utility scripts
├── schema.sql          # SQLite schema applied to Cloudflare D1
└── wrangler.toml       # Cloudflare Workers configuration file

## Phase-by-Phase Communication Flow

[Phase 1: Product Inception] ──> [Phase 2: Technical Design] ──> [Phase 3: Sprint Execution]
 │
 [Phase 6: Release & Delivery] <── [Phase 5: Verification, Feedback & Sprint Review] <────────┘

### Phase 1: Product Inception & Requirement Gathering

In this phase, the product strategy is established. The business goals are translated into actionable specifications before any engineering work begins.

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **Product Manager / PO** | docs/REQUIREMENTS.md (existing version) | docs/REQUIREMENTS.md (updated specs/BDD) |
| **Scrum Master** | docs/REQUIREMENTS.md | STATUS.md |
| **Software Architect** | docs/REQUIREMENTS.md | *None (Observation phase)* |

* **Key Action/Artifact:** The Product Owner updates the Product Requirement Document (docs/REQUIREMENTS.md) outlining user journeys and strict Behavior-Driven Development (BDD) Gherkin-formatted acceptance criteria.

### Phase 2: Architectural Blueprints & API Design

Before developers write code, the system architecture, database design, and API contracts must be explicitly agreed upon to prevent integration bottlenecks.

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **Software Architect** | docs/REQUIREMENTS.md | docs/adr/NNNN-*.md (ADRs)  schema.sql |
| **Senior Backend Engineer** | docs/adr/  schema.sql | worker/src/index.js (route design stub) |
| **Senior Frontend Engineer** | docs/adr/ | frontend/src/api/client.js (mock endpoints) |
| **QA & Test Automation** | docs/REQUIREMENTS.md  schema.sql | scripts/test-worker.mjs (draft assertions) |

* **Key Action/Artifact:** The Software Architect creates the Architectural Decision Record (docs/adr/NNNN-*.md) and designs the SQLite database structure (schema.sql). This decouples worker and frontend development, enabling parallel progress.

### Phase 3: Sprint Execution (The Code Loop)

Engineering teams execute tasks in iterative parallel paths. Frontend and backend developers strictly adhere to Test-Driven Development (TDD), writing tests *before* writing functional code.

[Developer pulls DB Schema & ADR]
 │
 ┌───────────┴───────────┐
 ▼                       ▼
 [Backend Code]          [Frontend Code]
 - Write smoke assertions - Mock worker routing
 - Code handler to pass   - Build React components
 - Refactor               - Add Vanilla CSS styles
 │                       │
 └───────────┬───────────┘
             ▼
      [Push to Branch]

#### A. Backend Engineering Stream

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **Senior Backend Engineer** | docs/adr/  schema.sql | worker/src/index.js (Worker routes/auth/handlers)  scripts/test-worker.mjs (assertion updates) |
| **Software Architect** | worker/src/index.js | *Peer feedback / Code review approvals* |

#### B. Frontend Engineering Stream

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **Senior Frontend Engineer** | docs/adr/  frontend/src/styles.css | frontend/src/ (React Components/Pages/State)  frontend/src/styles.css (Vanilla CSS styling) |

#### C. QA Automation Stream

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **QA & Test Automation** | docs/REQUIREMENTS.md  schema.sql | scripts/test-worker.mjs (E2E & smoke tests) |

### Phase 4: CI/CD Infrastructure & Security Gates

As developers push code changes to their feature branches, DevOps structures automated checks to protect system stability and maintain codebase health.

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **DevOps & Infra Engineer** | docs/adr/  wrangler.toml | .github/workflows/ci.yml (CI Pipeline)  wrangler.toml (Env config/bindings) |
| **QA & Test Automation** | .github/workflows/ci.yml | scripts/test-worker.mjs (CI runner commands) |
| **Software Architect** | .github/workflows/ci.yml | docs/adr/ (Security update notes) |

* **Key Action/Artifact:** DevOps establishes the automation configs (.github/workflows/ci.yml). Every Pull Request automatically triggers linter checks, Node test execution (`node scripts/test-worker.mjs`), and deployment bundle dry-runs.

### Phase 5: Verification, Feedback & Sprint Review

Before code is integrated into the production-ready branch, the Scrum Master and Product Owner run quality check gates.

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **QA & Test Automation** | scripts/test-worker.mjs | docs/REVIEWS.md (Log review runs / results) |
| **Product Manager / PO** | docs/REVIEWS.md | STATUS.md (Stage updates) |
| **Scrum Master** | .github/workflows/ logs | STATUS.md (Sprint burn-down & blocker status) |

* **Key Action/Artifact:** The Scrum Master runs the Retrospective, documenting process improvements in STATUS.md or docs/REVIEWS.md. The Product Owner assesses the automated test verification results to complete the sprint validation check.

### Phase 6: Deployment & Release Delivery

The code is securely deployed to production, monitored, and confirmed to meet stability thresholds.

| **Role** | **Reads From** | **Writes To** |
| --- | --- | --- |
| **DevOps & Infra Engineer** | wrangler.toml | Deploy output  wrangler secrets (e.g. JWT_SECRET) |
| **Product Manager / PO** | STATUS.md | CHANGELOG.md  frontend/src/version.js |
| **All Engineering Roles** | CHANGELOG.md | *Production deployment verified* |

---

## Escalation Matrix & Feedback Loops

* **API / Database Schema Mismatch:** If Backend and Frontend teams identify integration differences during development, they must collectively request a design revision.
  + *Rule:* Neither engineer can modify database schema definitions in `schema.sql` or endpoint routing patterns in `worker/src/index.js` without approval from the **Software Architect**.
* **Failed Pipeline Tests:** If a test breaks on integration, **QA & Test Automation** logs the breakdown in the PR, halting delivery.
  + *Rule:* The **DevOps Engineer** must configure the branch protection rules to block any merge to main until tests pass.
* **Scope Creep / Incomplete Acceptance Criteria:** If engineers find missing parameters in a feature story, they block the story.
  + *Rule:* The **Product Owner** must update docs/REQUIREMENTS.md with detailed requirements before work resumes.