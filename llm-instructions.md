# PharmaRoute LLM Instructions & Project Memory

This document serves as the project memory and set of instructions for coding agents working on the **PharmaRoute** project. It defines the tech stack, implementation rules, UI/UX guidelines, and best practices.

## Tech Stack Overview

PharmaRoute is a mobile-first web application designed to streamline the sales and order management process for pharmaceutical sales representatives.

### Frontend

- **Framework:** TanStack Start (Full-stack React framework using TanStack Router)
- **Runtime/Language:** TypeScript / React 19
- **Styling:** Tailwind CSS v4
- **State Management & Data Fetching:** TanStack Query, tRPC (`@trpc/tanstack-react-query`)
- **Icons:** Lucide React

### Backend API & Server

- **Framework:** TanStack Start Server Functions / tRPC
- **Validation:** Zod
- **Database Access:** Drizzle ORM

### Database & Auth

- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Drizzle ORM + Drizzle Kit
- **Auth:** Better Auth

### Testing

- **Test Framework:** Vitest
- **Test Utils:** `@testing-library/react`, `@testing-library/dom`

### Tooling

- **Package Manager:** pnpm
- **Linting & Formatting:** Biome
- **Type Checking:** TypeScript

### Observability & Monitoring

- **Error Tracking & Instrumentation:** Sentry (`@sentry/tanstackstart-react`)
- **Environment:** dotenv, `@t3-oss/env-core`

---

## Implementation Best Practices

### 0 — Purpose

These rules ensure maintainability, safety, and developer velocity.
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions if requirements in PRD/Design are ambiguous.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

### 2 — While Coding

- **C-1 (MUST)** Follow TDD: scaffold stub → write failing test → implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency (e.g., `Rep`, `Route`, `Pharmacy`, `Order`).
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Prefer branded `type`s for IDs.
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self-explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when more readable or interface merging is required.
- **C-9 (MUST)** Implement proper error boundaries in React components.
- **C-10 (MUST)** Use TanStack Start server functions (`createServerFn`) or tRPC for backend operations.

---

### 3 — Sentry Error Collection & Instrumentation (from `.cursorrules`)

- **SENTRY-1 (MUST)** Error collection is automatic and configured in `src/router.tsx`.
- **SENTRY-2 (MUST)** Instrument all server functions. If you see a function name like `createServerFn`, wrap the implementation with Sentry:

```tsx
import * as Sentry from '@sentry/tanstackstart-react'

// Inside createServerFn or API route:
Sentry.startSpan({ name: 'Requesting all the pokemon' }, async () => {
  // Some lengthy operation here
  await fetch('https://api.pokemon.com/data/')
})
```

---

### 4 — Testing

- **T-1 (MUST)** For a simple function, colocate unit tests in `*.spec.ts` or `*.test.ts`.
- **T-2 (MUST)** For any API change, add/extend integration tests.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.
- **T-5 (SHOULD)** Run `pnpm test` to ensure Vitest test suite passes.

---

### 5 — Database

- **D-1 (MUST)** Use Drizzle ORM for all database operations.
- **D-2 (MUST)** Database uses Neon PostgreSQL with HTTP connection (`@neondatabase/serverless`).
- **D-3 (MUST)** Use Drizzle Kit for migrations:
    - `pnpm db:generate` - Generate migration files
    - `pnpm db:migrate` - Run migrations
    - `pnpm db:push` - Push schema changes directly (dev only)
    - `pnpm db:studio` - Open Drizzle Studio

---

### 6 — Authentication & Authorization

- **AUTH-1 (MUST)** Use Better Auth for all authentication.
- **AUTH-2 (MUST)** Adhere to the strict Role Hierarchy: Super Admin > Admin > Sales Rep.
- **AUTH-3 (MUST)** Sales Reps should only see Routes and Medicines assigned to them (via `Rep_Routes` and `Rep_Medicines` junction tables).

---

### 7 — Tooling Gates

- **G-1 (MUST)** Use Biome for formatting and linting. Do not use Prettier or ESLint.
- **G-2 (MUST)** `pnpm format` and `pnpm lint` must pass.
- **G-3 (MUST)** `pnpm check` (Biome check) must pass.

---

### 8 — Styling & UI/UX Guidelines (from `docs/design.md`)

- **S-1 (MUST)** Always use **Tailwind CSS v4** classes.
- **S-2 (MUST)** Follow the **"Quietly Editorial"** design language: white canvas background, dark ink type (`{colors.ink}`: `#181d26`), and near-black primary actions (`{colors.primary}`: `#181d26`).
- **S-3 (MUST)** Use **Haas Grotesk** for all UI labels, navigation, and headers.
- **S-4 (MUST)** Use **Inter Display** exclusively for numerical data (prices, quantities, dates, totals) for commercial precision.
- **S-5 (MUST)** Use Signature Workflow Surfaces properly:
    - `{colors.signature-cream}` (`#f5e9d4`): For inventory items / active selection phase.
    - `{colors.signature-forest}` (`#0a2e0e`): For success states / order completions.
    - `{colors.signature-coral}` (`#aa2d00`): For alerts / out of stock.
- **S-6 (MUST)** Mobile-First Rhythm: Vertical rhythm locked to `16px` for form clusters and `96px` for major section transitions. Order summary bar should be sticky on mobile.
- **S-7 (MUST)** Zero Latency Selectors: Use TanStack Query to pre-fetch or cache route/pharmacy data to ensure cascading dropdowns (Date → Route → Pharmacy) feel instantaneous.

---

### 9 — Git & Commits

- **GH-1 (MUST)** Use Conventional Commits format.
- **GH-2 (MUST NOT)** Reference Claude, Anthropic, Gemini, or AI tools in commit messages or descriptions.
- **GH-3 (MUST)** Run quality checks (`pnpm check`, `pnpm test`, `pnpm build`) before pushing.

---

## Development Scripts

```bash
# Development
pnpm dev              # Start the dev server with vite and server instruments

# Build & Preview
pnpm build            # Build the TanStack Start app
pnpm preview          # Preview production build
pnpm start            # Start production server

# Code Quality
pnpm format           # Format code with Biome
pnpm lint             # Lint code with Biome
pnpm check            # Run all Biome checks
pnpm test             # Run Vitest tests

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run Drizzle migrations
pnpm db:push          # Push schema directly (dev)
pnpm db:pull          # Pull schema from DB
pnpm db:studio        # Open Drizzle Studio
```

---

## Troubleshooting

- **Build fails:** Ensure environment variables are loaded properly using `dotenv-cli` as configured in package.json.
- **Sentry Errors in Dev:** Ensure the node process is started with `--import ./instrument.server.mjs` as seen in the `dev` script.
- **Database schema out of sync:** Run `pnpm db:push` in dev, or regenerate and run migrations.

---

## Writing Functions Best Practices

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust?
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead?
8. Brainstorm 3 better function names and see if the current name is the best, consistent with the rest of the codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:
- The refactored function is used in more than one place.
- The refactored function is easily unit testable while the original function is not AND you can't test it any other way.
- The original function is extremely hard to follow and you resort to putting comments everywhere just to explain it.

---

## Writing Tests Best Practices

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (Biome, strict types).
6. SHOULD express invariants or axioms rather than single hard-coded cases whenever practical.
7. Unit tests for a function should be grouped under `describe(functionName, () => ...)`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g., UUIDs or dates).
9. ALWAYS use strong assertions over weaker ones e.g., `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.
