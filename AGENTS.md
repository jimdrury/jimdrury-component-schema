# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## Commands

```bash
yarn install          # Install dependencies
yarn plan             # Preview changes against Storyblok (read-only)
yarn apply            # Apply changes to Storyblok
yarn test             # Run tests (unit only)
yarn test:watch       # Run tests in watch mode
yarn lint             # Check with Biome
yarn lint:fix         # Auto-fix lint issues
yarn format           # Format with Biome
```

To run a single test file:
```bash
yarn vitest run src/path/to/file.test.ts
```

## Environment

Create `.env.local` with:
```
STORYBLOK_API_TOKEN=your-management-api-token
STORYBLOK_SPACE_ID=your-space-id
```

Files matching `*.integration.test.ts` hit the real Storyblok API and require credentials.

## Architecture

This is a Terraform-style CLI for managing Storyblok components as TypeScript source files. The workflow is: define components in `components/` → `yarn plan` diffs local vs remote → `yarn apply` executes the diff against the API.

### Data flow

```
components/*.ts  →  discoverComponents()  →  computePlan()  →  applyPlan()
                                                    ↓
                                           Storyblok API (read)
```

- **`src/discover.ts`** — dynamically imports each `components/*.ts` file and collects the default exports as `ComponentDefinition` objects.
- **`src/plan.ts`** — fetches remote state (components, folders, tags), diffs it against local definitions, and returns a `Plan` with typed `PlanAction[]`.
- **`src/apply.ts`** — executes a `Plan` against the API in dependency order: folders first (shallow-to-deep), then tags, then creates/updates, then deletes (components first, folders deep-to-shallow).
- **`src/payload.ts`** — converts a `ComponentDefinition` into a Storyblok API payload, resolving folder paths → UUIDs and tag names → IDs.
- **`src/api/storyblok.ts`** — thin Axios wrapper around the Storyblok Management API.
- **`src/env.ts`** — loads `.env`/`.env.local`, validates with Zod, and exports the singleton `storyblokApi`.

### Schema layer

`src/schema/` contains the public API used in `components/*.ts` files:

- **`component-type/`** — `contentType()` and `nestable()` factory functions. Each validates params with Zod, then calls `buildSchema()` to convert the `schema` array into a keyed object (handling `tab()` grouping).
- **`field-type/`** — one file per Storyblok field type (`text`, `richtext`, `blocks`, `asset`, etc.). Each factory validates with its Zod schema and returns an object with `_name` (stripped before sending to the API) and `type` plus field-specific props.

The `_name` internal property carries the field key through the type system; `buildSchema()` strips it and uses it as the object key.

### Path alias

`~` resolves to `src/` (configured in `vitest.config.ts` and used in imports throughout).

### Code style (Biome)

- Single quotes, semicolons, trailing commas, 2-space indent, 100-char line width.
- `import type` required for type-only imports (`useImportType: error`).
- Node built-ins must use the `node:` protocol.
