## AI-first Monorepo

Minimal, end-to-end starter for an AI-first product: a polished Next.js landing (preview) powered by a NestJS API with MongoDB, sharing strict types across the stack.

This workspace contains:

- `packages/frontend`: Next.js App Router (TypeScript)
- `packages/backend`: NestJS (TypeScript) + Mongoose
- `packages/shared`: Shared types and utilities (`@shared/*`)

See deeper docs:

- Frontend guide: `packages/frontend/README.md`
- Backend guide: `packages/backend/README.md`

### Prerequisites

- Node.js 20+ (Corepack enabled)
- pnpm (via Corepack): `corepack enable && corepack prepare pnpm@10 --activate`

### Install

```
corepack pnpm install
```

### Develop

Run in two terminals:

```
pnpm dev:web   # Next.js at http://localhost:3000
pnpm dev:api   # NestJS at http://localhost:3001
```

### Build & test

```
pnpm build
pnpm test
```

### TypeScript paths

Import shared types from `@shared/*` (points to `packages/shared/src/*`).

```ts
import type { Idea, Section } from '@shared/types';
```
