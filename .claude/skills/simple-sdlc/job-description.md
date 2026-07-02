# Engineering Role Definitions

## 1. Software Architect & Technical Lead

### Role Summary

The Software Architect & Technical Lead is the guardian of our system design, technical standards, and code quality. This role bridges the gap between high-level business goals and clean, scalable, maintainable implementation on serverless edge environments. You will establish the engineering blueprints (such as Cloudflare Workers and D1 database layouts), enforce the technology stack, and mentor developers to ensure the team produces clean, modular code.

### Key Responsibilities

* **Architectural Blueprinting:** Design scalable, resilient, and secure system architectures tailored for Cloudflare Workers (V8 isolates), D1 database, and static asset fallbacks.
* **Security & Auth Design:** Design row-level data isolation (ensuring all DB queries filter by `user_id`) and stateless JWT auth.
* **Timezone Rules:** Enforce consistent GMT+7 (`TIMEZONE_OFFSET = 7`) date handling across client and server.
* **User Constraints:** Enforce the 50-user registration cap (excluding the owner).
* **Standards & Practices:** Establish and enforce coding standards, code styles, and engineering guidelines. Champion the adoption of Clean Code principles (SOLID, DRY, KISS) and Test-Driven Development (TDD).
* **Code Quality & Code Reviews:** Lead critical code reviews and establish strict gates for pull requests to guarantee codebase hygiene.

### Requirements & Technical Skills

* **Experience:** 5+ years in software engineering, with experience in a technical leadership or architectural role.
* **Systems Design:** Deep understanding of edge computing runtimes (V8 isolates, Cloudflare Workers), stateless JWT authentication, and secure request routing fallback patterns.
* **Database Expertise:** Mastery of SQLite (Cloudflare D1), data migration designs, query optimization, and row-level data isolation architectures.
* **Methodologies:** Deep expertise in Test-Driven Development (TDD), Behavior-Driven Development (BDD), and continuous refactoring.
* **Documentation:** Ability to write comprehensive Architectural Decision Records (ADRs) under `docs/adr/`.

### Key Performance Indicators (KPIs)

* **System Reliability:** Uptime and SLA compliance of Cloudflare edge services.
* **Codebase Health:** Reduction in technical debt and maintainability index scores.
* **Delivery Speed:** Lead time for changes of newly architected components.
* **Team Velocity:** Quality and speed of engineering output under your technical guidance.

---

## 2. Senior Backend Engineer

### Role Summary

The Senior Backend Engineer is responsible for designing, building, and maintaining the robust server-side logic, databases, and APIs that power our applications. In this role, you will be expected to write highly optimized, clean, and self-documenting code. You will lead by example, utilizing TDD to deliver thoroughly tested APIs inside Cloudflare Workers.

### Key Responsibilities

* **Core Feature Development:** Implement secure, performant, and reliable APIs, routing endpoints, and rate-limiting logic inside Cloudflare Workers (`worker/src/index.js`).
* **Decimal Step Logic:** Handle decimal ratings between `1.0` and `10.0` in `0.1` steps for Happiness and Progress.
* **Test-Driven Development:** Write comprehensive unit and integration assertions inside `scripts/test-worker.mjs` before writing production code.
* **Database Design & Optimization:** Write clean database tables and optimize SQLite queries on Cloudflare D1 to ensure low-latency edge responses.
* **Thorough Documentation:** Write clean, readable code supplemented by precise comments explaining *why* complex logic was written.
* **System Integration:** Integrate stateless JWT session handling using `jose` (`HS256`), password hashing via `bcryptjs` (cost 12), and timezone offsets.

### Requirements & Technical Skills

* **Experience:** 3+ years of experience in backend development using Node.js, JavaScript, and TypeScript.
* **Frameworks:** Expert knowledge of Cloudflare Workers routing, V8 isolate environment contexts, and the Wrangler CLI.
* **Testing Suites:** High proficiency in Node.js test scripts and mocking SQLite database instances (in-memory D1 mocks).
* **APIs:** Expert knowledge of RESTful API design on edge runtimes.
* **Security Standards:** Solid understanding of JWT (`jose` library), password hashing (`bcryptjs`), and input validation/sanitization.

### Key Performance Indicators (KPIs)

* **Test Coverage & Quality:** Percentage of code verified by smoke-test assertions and lack of regressions.
* **API Performance:** Average response times (p95/p99) and error rates under load.
* **Code Quality:** Adherence to ESLint / Biome / static standards and peer review feedback.
* **Issue Resolution Time:** Speed and quality of bug diagnostics and patching in worker scripts.

---

## 3. Senior Frontend Engineer

### Role Summary

The Senior Frontend Engineer designs and implements highly responsive, accessible, and interactive user interfaces. This role requires a balance of aesthetic sensibility, component-driven design, and client-side state management. You are expected to treat the frontend codebase with the same architectural rigor as the backend, ensuring clean code, modular components, and Vanilla CSS styling.

### Key Responsibilities

* **UI/UX Implementation:** Translate mockups (including Memento Mori grid, History search, and Today log sliders) into pixel-perfect, responsive, and cross-browser-compatible web interfaces under `frontend/src/`.
* **CSS & Design Standards:** Write clean, modular, and responsive Vanilla CSS using root variables defined in `frontend/src/styles.css`.
* **State Management:** Design and maintain predictable React client-side state architecture without relying on heavy global state libraries.
* **Component Engineering:** Build reusable, accessible (WCAG compliant) components under `frontend/src/components/`.
* **Performance Optimization:** Optimize bundle sizes, implement lazy loading, and fine-tune rendering cycles to maximize Core Web Vitals (LCP, INP, CLS).
* **PWA & Session Storage:** Implement offline app shell caching configurations via `vite-plugin-pwa` and manage JWT storage in `localStorage` (`task-logger:jwt`).

### Requirements & Technical Skills

* **Experience:** 3+ years in frontend engineering, focusing on React single-page applications (SPAs).
* **Frameworks:** Mastery of React and Vite.
* **Testing Tools:** Experience with Jest or Vite-based React Testing Library, and browser developer tools.
* **Styling & UI:** Deep knowledge of Vanilla CSS, custom CSS properties, keyframes, transitions, and responsive web design.
* **Build Tools:** Experience with Vite build configurations and Service Worker generation.

### Key Performance Indicators (KPIs)

* **Core Web Vitals:** Performance scores (LCP, INP, CLS) across desktop and mobile devices.
* **Component Reusability:** Percentage of code using reusable shared components versus duplicate implementations.
* **Accessibility Compliance:** Adherence to WCAG 2.1 AA guidelines on audited pages.
* **Feature Delivery Rate:** On-time delivery of intuitive interactive flows with zero UI regressions.

---

## 4. QA & Test Automation Engineer

### Role Summary

The QA & Test Automation Engineer shifts quality assurance "left" in the software development lifecycle. Rather than acting as a post-development gate, you will collaborate with Product Managers and Developers *before* development begins to write clear acceptance criteria. You will construct and maintain the automated smoke test runner script (`scripts/test-worker.mjs`) that validates backend and user auth logic.

### Key Responsibilities

* **Test Strategy & Planning:** Create comprehensive, risk-based test plans and test suites mapping to product features.
* **Automation Framework Engineering:** Build, expand, and maintain the programmatic smoke testing framework (`scripts/test-worker.mjs`).
* **Test Case Coverage:** Explicitly test row-level isolation (users cannot query others' entries), JWT authentication, rating constraints, date-boundary validation, and user limits.
* **Mock Data Management:** Manage mock database initializations, JWT payloads, and test fixtures.
* **CI/CD Pipeline Integration:** Integrate test suites into GitHub Actions workflows to block broken code from entering the main branch.
* **Bug Diagnostics:** Pinpoint, document, and reproduce complex issues, providing engineers with precise logs, payload states, and diagnostic steps.

### Requirements & Technical Skills

* **Experience:** 3+ years in software quality assurance, with focus on test automation.
* **Automation Tools:** Mastery of programmatic HTTP assertions, Node.js script testing, and browser testing.
* **API Testing:** Proficient with programmatic API test frameworks and mock D1 environments.
* **Languages:** Strong scripting skills in JavaScript/TypeScript.
* **Testing Methodologies:** Deep understanding of unit/integration testing, auth flow simulation, and JWT verification.

### Key Performance Indicators (KPIs)

* **Defect Leakage:** Percentage of bugs discovered by users in production versus during the testing cycle.
* **Test Run Time:** Total duration of the automated regression suite (optimized for quick feedback cycles).
* **Test Stability:** Minimize "flaky" tests to maintain developer trust in the automated feedback loop.
* **Smoke Suite Coverage:** Coverage of core user journeys (signup, login, JWT validation, CRUD, row isolation).

---

## 5. DevOps & Infrastructure Engineer

### Role Summary

The DevOps & Infrastructure Engineer owns the automation, security, and scalability of our infrastructure and delivery pipelines on Cloudflare. This role is responsible for enabling developers to ship clean, tested code quickly and safely. You will configure Wrangler deployment templates, build automated CI/CD pipelines in GitHub Actions, and ensure environments are secure.

### Key Responsibilities

* **Wrangler Configuration:** Manage and standardize environment provisioning using `wrangler.toml`, ensuring development, staging, and production assets/D1 bindings are identical.
* **CI/CD Pipeline Design:** Build optimized GitHub Actions workflows (`.github/workflows/`) that automatically run linters, Node.js smoke tests (`scripts/test-worker.mjs`), and handle deployments.
* **Secrets Management:** Securely configure environment secrets (such as `JWT_SECRET`) via Wrangler CLI (`wrangler secret put`) and GitHub repository settings.
* **Observability & Analytics:** Analyze Cloudflare Worker analytics, logs, and billing thresholds to ensure optimal runtime health.

### Requirements & Technical Skills

* **Experience:** 3+ years in DevOps, System Administration, or Site Reliability Engineering (SRE).
* **Cloud Providers:** Deep expertise in Cloudflare developer ecosystem (Workers, Pages, D1 databases).
* **Wrangler Ecosystem:** Mastery of Wrangler CLI commands, asset configurations, and KV/D1 database bindings.
* **CI/CD Ecosystems:** High proficiency in GitHub Actions.

### Key Performance Indicators (KPIs)

* **Deployment Frequency:** How often the organization can safely deploy changes to production.
* **Lead Time for Changes:** The time it takes for a code commit to successfully run in production.
* **Mean Time to Recovery (MTTR):** Average time taken to restore services after a deployment degradation.
* **Change Failure Rate:** Percentage of deployments that cause a degradation of service or require rollback.

---

## 6. Product Manager / Product Owner

### Role Summary

The Product Manager / Product Owner owns the product vision, roadmap, and backlog. This role acts as the vital bridge between users, business objectives, and the engineering team. By drafting precise, highly descriptive user stories and clear acceptance criteria in `docs/REQUIREMENTS.md`, you enable developers to design robust technical solutions.

### Key Responsibilities

* **Backlog Management:** Own, prioritize, and refine the product backlog. Ensure user stories are detailed, groomed, and ready for development.
* **Defining "Done":** Draft strict Acceptance Criteria (BDD/Gherkin format preferred) under `docs/REQUIREMENTS.md` to guide developer implementations.
* **Roadmap Alignment:** Define short-term sprint goals and long-term release milestones that align with project goals.
* **Release Logs:** Maintain the single source of truth for version history in `CHANGELOG.md` and bump `frontend/src/version.js` before each deployment.

### Requirements & Technical Skills

* **Experience:** 3+ years in Product Management, Product Ownership, or Business Analysis within a software engineering environment.
* **Agile Tooling:** High proficiency with Markdown, Git documentation structures, and agile backlogs.
* **Technical Literacy:** Ability to understand technical constraints, worker edge limitations, and SQLite schema capabilities.

### Key Performance Indicators (KPIs)

* **On-Time Delivery:** Percent of committed roadmap features delivered within projected release windows.
* **Feature Adoption:** User engagement and adoption rates of newly released features.
* **Backlog Readiness:** Ratio of sprint-ready stories (fully defined and groomed) to active developer velocity.
* **Sprint Goal Success Rate:** Percentage of sprint cycles where the core business goal was accomplished.

---

## 7. Scrum Master / Agile Project Manager

### Role Summary

The Scrum Master / Agile Project Manager is the facilitator of agile processes and team delivery health. Rather than managing through top-down mandates, you lead through coaching and serving. Your main objective is to eliminate blockers, shield the development team from external disruptions, and run standups and sprint retrospectives to optimize velocity and morale.

### Key Responsibilities

* **Sprint Coordination:** Coordinate sprint progress, keeping the team focused and aligned to the goals defined in `STATUS.md`.
* **Blocker Removal:** Proactively identify and eliminate technical, organizational, and resource-related impediments hindering team progress.
* **Process Improvement:** Lead team retrospectives that generate actionable, measurable improvements to sprint workflows, documented under `docs/REVIEWS.md` or `STATUS.md`.
* **Metrics Tracking:** Monitor progress gates and update the active stage tracking inside `STATUS.md`.

### Requirements & Technical Skills

* **Experience:** 2+ years acting as a Scrum Master, Agile Coach, or Delivery Manager in software development.
* **Conflict Resolution:** Strong mediation and communication skills to navigate cross-functional bottlenecks.
* **Status Documentation:** Experience tracking and managing lightweight Git-based project status files.

### Key Performance Indicators (KPIs)

* **Sprint Predictability:** The variance between planned velocity and actual delivered features.
* **Cycle Time Reduction:** Time taken for a task to go from "In Progress" to "Done."
* **Blocker Resolution Time:** Mean time to clear escalated team blockers.
* **Team Health & Morale:** Qualitative feedback scores from retrospectives.