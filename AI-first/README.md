## AI-first Monorepo

This is a pnpm workspace monorepo containing:

- `packages/frontend`: Next.js 14 App Router (TypeScript)
- `packages/backend`: NestJS 10 (TypeScript)
- `packages/shared`: Shared TypeScript library

### Prerequisites

- Node.js 20+ (Corepack enabled)
- pnpm (via Corepack): `corepack enable && corepack prepare pnpm@10 --activate`

### Install

```
corepack pnpm install
```

### Develop

Run frontend and backend in separate terminals:

```
pnpm dev:web
pnpm dev:api
```

Frontend dev server runs on `http://localhost:3000`. Backend dev server runs on `http://localhost:3001` (configure port in Nest if desired).

### Build

```
pnpm build
```

### Lint

```
pnpm lint
```

### Test

```
pnpm test
```

### TypeScript path aliases

Both apps are configured to import shared code using `@shared/*` which points to `packages/shared/src/*`.

Example usage in Next.js:

```ts
import { sharedExample } from '@shared/index';
```

Example usage in NestJS:

```ts
import { sharedExample } from '@shared/index';
```
