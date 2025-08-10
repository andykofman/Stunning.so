## Backend (NestJS)

NestJS API that persists ideas and returns structured sections for the landing preview.

### Scripts

```
pnpm start:dev
pnpm start
pnpm test
```

### Structure

- `src/app.module.ts`: Root wiring (Config, DB, `IdeasModule`)
- `src/database/`: Database module and configuration
- `src/ideas/`:
  - `ideas.controller.ts`: REST endpoints
  - `ideas.service.ts`: Business logic and Mongoose access
  - `schemas/idea.schema.ts`: Idea model (idea text + sections)
  - `schemas/section.schema.ts`: Section model (key/title/body/order)
  - `dto/create-idea.dto.ts`: Validation for create
- `src/common/`:
  - `pipes/mongo-id.pipe.ts`: Validates `:id` params
  - `filters/validation-exception.filter.ts`: Request validation formatting

### Endpoints

- `GET /api/ideas`: List all ideas
- `GET /api/ideas/:id`: Get single idea by id
- `POST /api/ideas`: Create idea `{ idea: string }`

On create, the service currently derives default sections from the idea text:

```ts
static buildDummySections(idea: string): Section[] { /* hero, about, contact */ }
```

### Data flow

1. Client calls `POST /api/ideas` with `{ idea }`.
2. API persists an `Idea` document with `sections` (defaulted or provided).
3. Client navigates to `/preview/:id` and calls `GET /api/ideas/:id` to render sections.

### Environment

Configuration is loaded via `@nestjs/config` from `.env`. The database module sets up the Mongo connection.

### Testing

Unit and e2e tests are scaffolded; see `test/` and `src/ideas/ideas.service.spec.ts`.
