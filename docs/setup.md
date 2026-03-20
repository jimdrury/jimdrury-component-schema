# Setup

## Installation

This package is published to the GitHub Package Registry. Point your package manager at it before installing.

### npm / Yarn 1

Add a `.npmrc` to your project root:

```
@jimdrury:registry=https://npm.pkg.github.com
```

### Yarn 2+ (Berry)

Add to your `.yarnrc.yml`:

```yaml
npmScopes:
  jimdrury:
    npmRegistryServer: https://npm.pkg.github.com
```

### Install

```bash
npm install @jimdrury/storyblok-component-schema
# or
yarn add @jimdrury/storyblok-component-schema
```

### GitHub Actions

In CI, use `actions/setup-node` to configure the registry:

```yaml
- uses: actions/setup-node@v6
  with:
    registry-url: https://npm.pkg.github.com
    scope: '@jimdrury'
- run: yarn install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Configuration

Create a `.component-schema.yaml` file in your project root:

```yaml
componentsDir: ./components

storyblok:
  apiToken: "${STORYBLOK_API_TOKEN}"
  spaceId: "${STORYBLOK_SPACE_ID}"
```

All fields are optional. The CLI falls back to environment variables and defaults when they are not set.

### Environment variable interpolation

Values wrapped in `${...}` are resolved from environment variables at runtime, just like `.yarnrc.yml`. You can use literal values too:

```yaml
storyblok:
  apiToken: "${STORYBLOK_API_TOKEN}"
  spaceId: "12345"
```

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `componentsDir` | `string` | `./components` | Path to the directory containing component `.ts` files. |
| `storyblok.apiToken` | `string` | -- | Storyblok Management API token. Falls back to `STORYBLOK_API_TOKEN` env var. |
| `storyblok.spaceId` | `string` | -- | Target Storyblok space ID. Falls back to `STORYBLOK_SPACE_ID` env var. |

### Resolution order

Configuration is resolved with the following precedence (highest wins):

1. **CLI flags** (`--dir`)
2. **Config file** (`.component-schema.yaml`)
3. **Environment variables** (via `.env` / `.env.local`)
4. **Defaults** (`componentsDir: ./components`)

### Without a config file

If you prefer not to use a config file, you can set environment variables directly. Create a `.env.local` file:

```
STORYBLOK_API_TOKEN=your-management-api-token
STORYBLOK_SPACE_ID=your-space-id
```

Or pass the components path via the `--dir` flag:

```bash
npx storyblok-component-schema plan --dir ./src/blocks
```

---

## Commands

### `npx storyblok-component-schema plan`

Compares local component definitions against the current state of your Storyblok space and outputs a plan of what would change. Nothing is modified -- this is a read-only preview.

```
Discovered 4 local component(s)
Refreshing Storyblok state...

Folder changes:

  + create folder "content"  (known after apply)

Component changes:

  + create component "page"   (known after apply)
  ~ update component "blog"   id: 12345
  - delete component "legacy"  id: 67890

Plan: 2 to create, 1 to update, 1 to delete.
```

| Symbol | Meaning |
|--------|---------|
| `+` | Resource will be **created** in Storyblok. ID is not yet known. |
| `~` | Resource exists remotely and will be **updated** in-place. |
| `-` | Resource exists in Storyblok but **not** locally -- it will be **deleted**. |

### `npx storyblok-component-schema apply`

Runs the same plan, then executes all changes against the Storyblok Management API. Changes are applied in dependency order:

1. Create missing **folders** (shallowest first).
2. Create missing **tags**.
3. **Create** new components and **update** existing ones.
4. **Delete** orphaned components.
5. **Delete** orphaned folders (deepest first).

The local component definitions are the **only source of truth**. Any components or folders that exist in Storyblok but are not defined locally will be deleted.
