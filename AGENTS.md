# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## Commands

```bash
yarn install          # Install dependencies
yarn build            # Build with tsup
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

- **`src/cli/discover.ts`** — dynamically imports each `components/*.ts` file and collects the default exports as `ComponentDefinition` objects.
- **`src/cli/plan.ts`** — fetches remote state (components, folders, tags), diffs it against local definitions, and returns a `Plan` with typed `PlanAction[]`.
- **`src/cli/apply.ts`** — executes a `Plan` against the API in dependency order: folders first (shallow-to-deep), then tags, then creates/updates, then deletes (components first, folders deep-to-shallow).
- **`src/cli/payload.ts`** — converts a `ComponentDefinition` into a Storyblok API payload, resolving folder paths → UUIDs and tag names → IDs.
- **`src/cli/api/storyblok.ts`** — thin Axios wrapper around the Storyblok Management API.
- **`src/cli/env.ts`** — loads `.env`/`.env.local`, validates with Zod, and returns a `StoryblokApi` instance.

### Schema layer

`src/schema/component-type/` and `src/schema/field-type/` contain the public API used in `components/*.ts` files:

- **`component-type/`** — `contentType()` and `nestable()` factory functions. Each validates params with Zod, then calls `buildSchema()` to convert the `schema` array into a keyed object (handling `tab()` grouping).
- **`field-type/`** — one file per Storyblok field type (`text`, `richtext`, `blocks`, `asset`, etc.). Each factory validates with its Zod schema and returns an object with `_name` (stripped before sending to the API) and `type` plus field-specific props.

The `_name` internal property carries the field key through the type system; `buildSchema()` strips it and uses it as the object key.

### Package

Published as `@jimdrury/storyblok-component-schema` on GitHub Package Registry. Component files import from this package (`import { nestable, text } from '@jimdrury/storyblok-component-schema'`). The package also provides a CLI binary (`storyblok-component-schema plan` / `storyblok-component-schema apply`).

### Code style (Biome)

- Single quotes, semicolons, trailing commas, 2-space indent, 80-char line width.
- Objects and arrays always expand to multiple lines (`expand: "always"`).
- `import type` required for type-only imports (`useImportType: error`).
- Node built-ins must use the `node:` protocol.
