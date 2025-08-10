## Frontend (Next.js)

Next.js App Router UI with a landing preview that renders sections from the API.

### Scripts

```
pnpm dev
pnpm build
pnpm start
pnpm lint
```

### Structure

- `src/app/`
  - `page.tsx`: Home
  - `create/page.tsx`: Form to create an idea (posts to the backend)
  - `ideas/page.tsx`: Ideas list
  - `preview/[id]/page.tsx`: Full-window landing preview (navbar, hero, about, features, contact, footer)
- `src/components/`: UI components (`toast`, `error-boundary`, etc.)
- `src/utils/`: `env.ts` (API base), `fetcher.ts`

### Data flow

1. User submits the form in `create/page.tsx` -> POST to `POST /api/ideas`.
2. On success, navigate to `preview/[id]`.
3. `preview/[id]/page.tsx` fetches `GET /api/ideas/:id`, sorts sections, renders hero/about/features/contact.

### Shared types

The app imports `Idea` and `Section` from `@shared/types` for strict typing across client and server.

### Styling & UX

- TailwindCSS with utility classes, accessible focus states, and reduced-motion awareness.
- Smooth scrolling is enabled globally; animations are disabled under `prefers-reduced-motion`.
- Hero uses a subtle animated gradient background.

### Environment

`API_BASE_URL` is resolved in `src/utils/env.ts`. During local dev it points to the backend origin.
