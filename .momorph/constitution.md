<!--
SYNC IMPACT REPORT
==================
Version change: N/A (new) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Tech Stack & Tooling
  - Development Workflow
  - Governance
Templates requiring updates:
  ✅ .momorph/templates/plan-template.md — Constitution Compliance Check aligns with all 6 principles
  ✅ .momorph/templates/spec-template.md — Responsive breakpoints and security TR fields align
  ✅ .momorph/templates/tasks-template.md — Security hardening and a11y tasks in Polish phase align
Follow-up TODOs: None — all placeholders resolved.
-->

# Agentic Coding Hands-on Constitution

## Core Principles

### I. Clean Code & Source Organization

All code MUST be readable, concise, and self-documenting. The following rules are non-negotiable:

- File and function names MUST be descriptive and in English (camelCase for variables/functions,
  PascalCase for components/classes, kebab-case for file names).
- Functions MUST do one thing only; functions exceeding ~50 lines MUST be refactored.
- No dead code, commented-out blocks, or unused imports are permitted in committed code.
- The `src/` directory MUST follow this structure:
  - `src/app/` — Next.js App Router pages, layouts, and route handlers
  - `src/components/` — Shared React components (atomic, reusable)
  - `src/libs/` — Third-party integrations (Supabase client, etc.)
  - `src/hooks/` — Custom React hooks
  - `src/services/` — Business logic and API call wrappers
  - `src/types/` — Shared TypeScript type definitions
  - `src/utils/` — Pure utility/helper functions
- Every new file MUST be placed in the most specific, appropriate folder; do not co-locate
  unrelated concerns.
- Path alias `@/*` (mapped to `src/*`) MUST be used for all internal imports.

**Rationale**: Consistent structure lets the team and AI agents navigate the codebase
predictably, reducing cognitive load and onboarding time.

### II. Next.js & Cloudflare Workers Best Practices

All implementation MUST leverage Next.js 15 App Router conventions and be compatible with
Cloudflare Workers edge runtime:

- React Server Components (RSC) MUST be used by default; client components (`"use client"`)
  MUST only be added when browser-only APIs or interactivity are required.
- Data fetching MUST use Server Components or Route Handlers; client-side fetching is only
  permitted when real-time or user-triggered updates are needed.
- Route Handlers (`src/app/api/**/route.ts`) MUST be used for API endpoints; they MUST be
  edge-compatible (no Node.js-only APIs).
- `@opennextjs/cloudflare` adapter MUST be used for all Cloudflare deployments; direct
  `wrangler` configuration in `wrangler.jsonc` MUST not conflict with Next.js build output.
- Environment variables MUST be accessed via `process.env` (Next.js) or `CloudflareEnv`
  (edge context) using the typed interface in `cloudflare-env.d.ts`; secrets MUST never be
  hard-coded.
- TailwindCSS v4 MUST be used for all styling; custom CSS MUST be limited to `globals.css`
  and component-level CSS Modules only when Tailwind utility classes are insufficient.

**Rationale**: Edge-first architecture minimises latency and leverages Cloudflare's global
network. Respecting RSC boundaries keeps the client bundle small.

### III. Supabase Integration Standards

All database access and authentication MUST go through the Supabase client following these rules:

- The `@supabase/ssr` package MUST be used for all server-side and middleware Supabase
  clients (see `src/libs/supabase/server.ts` and `src/libs/supabase/middleware.ts`).
- Browser-side access MUST use the browser client from `src/libs/supabase/client.ts`.
- Row Level Security (RLS) MUST be enabled on every table; access control logic MUST live
  in the database, not only in application code.
- Direct SQL mutations from the client MUST be forbidden; all mutations MUST go through
  typed Supabase client calls or RPC functions.
- Database migrations MUST be managed via the Supabase CLI (`supabase/migrations/`);
  manual schema changes in production are prohibited.
- Sensitive columns (e.g., passwords, tokens) MUST never be selected or returned unless
  strictly required, and MUST be excluded from default select queries.

**Rationale**: Centralised auth and data-access patterns prevent privilege escalation and
data leakage while keeping business logic testable.

### IV. Responsive Design (Mobile-First)

Every UI feature MUST be fully functional and visually correct at all three breakpoints:

- **Mobile**: `< 768px` (default styles, no prefix)
- **Tablet**: `≥ 768px` (`md:` prefix)
- **Desktop**: `≥ 1024px` (`lg:` prefix)

Rules:
- All layouts MUST be implemented mobile-first; desktop styles MUST be added via responsive
  prefixes, never by overriding with smaller-screen rules.
- Touch targets MUST be at least 44×44 px (WCAG 2.5.5).
- Images MUST use `next/image` with appropriate `sizes` attributes to serve responsive images.
- No horizontal scrollbar MUST appear at any of the three breakpoints.
- Responsive behaviour MUST be verified manually or via integration tests before marking a
  task complete.

**Rationale**: The application targets a mixed device audience. Mobile-first ensures the
core experience is never degraded on constrained screens.

### V. OWASP Security Standards (NON-NEGOTIABLE)

All code MUST comply with OWASP Top 10 mitigations. The following controls are mandatory:

- **Injection (A03)**: All database queries MUST use parameterised Supabase client calls;
  raw string interpolation into queries is forbidden.
- **Broken Authentication (A07)**: Authentication MUST use Supabase Auth; custom session
  management is forbidden. Session tokens MUST be stored in `HttpOnly` cookies via
  `@supabase/ssr`.
- **Sensitive Data Exposure (A02)**: Secrets and API keys MUST only reside in `.env`
  files (never committed) or Cloudflare/Supabase secret stores.
- **Security Misconfiguration (A05)**: CORS MUST be explicitly configured in Route
  Handlers; permissive `*` origins are forbidden in production.
- **XSS (A03)**: React's JSX output escaping MUST not be bypassed (`dangerouslySetInnerHTML`
  is forbidden without explicit sanitisation using a vetted library).
- **Insecure Direct Object References**: Resource access MUST always be validated against
  the authenticated user's identity via RLS or server-side checks.
- **Dependency vulnerabilities (A06)**: `yarn audit` MUST pass (no high/critical issues)
  before merging to `main`.

**Rationale**: Security defects discovered in production are exponentially more expensive
to fix. OWASP controls are the industry baseline; deviation requires documented justification.

### VI. Test-First Development (TDD — NON-NEGOTIABLE)

The Red-Green-Refactor cycle MUST be followed for all non-trivial logic:

1. Write a failing test that captures the expected behaviour.
2. Obtain stakeholder/reviewer approval on the test.
3. Implement the minimum code to make the test pass.
4. Refactor while keeping all tests green.

Rules:
- Unit tests MUST cover all service and utility functions.
- Integration tests MUST cover all Route Handler endpoints and Supabase interactions.
- E2E tests (Playwright) MUST cover all P1 user stories before a feature is considered
  done.
- Test files MUST be co-located or placed in a mirrored `tests/` tree and suffixed
  `.test.ts` / `.spec.ts`.
- Code coverage MUST not fall below 80% for `src/services/` and `src/utils/`.

**Rationale**: Tests written before implementation prevent scope creep, document intent,
and provide a safety net for future refactors.

## Tech Stack & Tooling

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15.x |
| Runtime | React | 19.x |
| Language | TypeScript | 5.x (strict mode) |
| Styling | TailwindCSS | 4.x |
| Backend-as-a-Service | Supabase | 2.x |
| Edge Deployment | Cloudflare Workers via `@opennextjs/cloudflare` | 1.x |
| Package Manager | Yarn | 1.22.22 |
| Node.js | Node.js | 24.x |
| Linting | ESLint (eslint-config-next) | 9.x |
| E2E Testing | Playwright | latest |

**Approved libraries**: Only libraries already present in `package.json` are pre-approved.
Adding a new runtime dependency MUST be justified in the PR description with alternatives
considered.

## Development Workflow

- **Branching**: Feature branches named `feat/<feature-slug>`, bug fixes `fix/<bug-slug>`.
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- **PR gate**: All CI checks (lint, type-check, unit tests, build) MUST pass before merge.
- **Constitution compliance**: Every PR description MUST include a Constitution Compliance
  checklist (see `plan-template.md`) confirming all six principles are satisfied.
- **Code review**: At least one peer review is required; security-sensitive changes require
  review by a senior engineer.
- **Secrets**: `.env` files MUST be listed in `.gitignore`; use `.env.example` for
  documentation of required variables.

## Governance

This constitution supersedes all other development guidelines. Any practice conflicting with
this document MUST be resolved in favour of this document unless an amendment is ratified.

**Amendment procedure**:
1. Open a PR with the proposed change to `.momorph/constitution.md`.
2. Provide a rationale and impact analysis (which principles change, which artifacts need
   updating).
3. Obtain approval from at least two senior engineers.
4. Update `CONSTITUTION_VERSION` following semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change.
   - **MINOR**: New principle or section added.
   - **PATCH**: Clarifications, wording, or typo fixes.
5. Update `LAST_AMENDED_DATE` to the merge date (ISO 8601).
6. Propagate changes to dependent templates (`plan-template.md`, `spec-template.md`,
   `tasks-template.md`) in the same PR.

All PRs and code reviews MUST verify compliance with this constitution. Violations that
cannot be resolved within the PR MUST be logged as tech-debt issues and addressed within
two sprints.

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09
