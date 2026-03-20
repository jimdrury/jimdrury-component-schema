---
name: install
description: >-
  Install and configure @jimdrury/storyblok-component-schema in a project.
  Use when the user wants to set up the package, configure the registry,
  create a config file, or connect to a Storyblok space.
---

# Install

Set up `@jimdrury/storyblok-component-schema` in a consuming project. This package is published to the GitHub Package Registry, not npm.

## 1. Configure the registry

The package manager needs to know where to find `@jimdrury` scoped packages.

### npm / Yarn 1

Add a `.npmrc` to the project root:

```
@jimdrury:registry=https://npm.pkg.github.com
```

### Yarn 2+ (Berry)

Add to `.yarnrc.yml`:

```yaml
npmScopes:
  jimdrury:
    npmRegistryServer: https://npm.pkg.github.com
```

## 2. Install the package

```bash
npm install @jimdrury/storyblok-component-schema
# or
yarn add @jimdrury/storyblok-component-schema
```

## 3. Create a config file

Create `.component-schema.yaml` in the project root:

```yaml
componentsDir: ./components
storyblok:
  apiToken: "${STORYBLOK_API_TOKEN}"
  spaceId: "${STORYBLOK_SPACE_ID}"
```

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `componentsDir` | `string` | `./components` | Path to the directory containing component `.ts` files. |
| `storyblok.apiToken` | `string` | -- | Storyblok Management API token. Falls back to `STORYBLOK_API_TOKEN` env var. |
| `storyblok.spaceId` | `string` | -- | Target Storyblok space ID. Falls back to `STORYBLOK_SPACE_ID` env var. |

All fields are optional. The CLI falls back to environment variables and defaults.

### Environment variable interpolation

Values wrapped in `${...}` are resolved from environment variables at runtime, just like `.yarnrc.yml`. Variables from `.env` and `.env.local` are loaded automatically.

You can also use literal values:

```yaml
storyblok:
  apiToken: "${STORYBLOK_API_TOKEN}"
  spaceId: "12345"
```

## 4. Set up credentials

Create a `.env.local` file (add to `.gitignore`):

```
STORYBLOK_API_TOKEN=your-management-api-token
STORYBLOK_SPACE_ID=your-space-id
```

The API token must have write access to the Storyblok space.

## 5. Verify

```bash
npx storyblok-component-schema plan
```

This should connect to your Storyblok space and report the current state.

## GitHub Actions

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

Set `STORYBLOK_API_TOKEN` and `STORYBLOK_SPACE_ID` as repository secrets or variables.

## Resolution order

Configuration is resolved with the following precedence (highest wins):

1. **CLI flags** (`--dir`)
2. **Config file** (`.component-schema.yaml`)
3. **Environment variables** (`.env` / `.env.local`)
4. **Defaults** (`componentsDir: ./components`)

## Checklist

- [ ] Registry configured (`.npmrc` or `.yarnrc.yml`)
- [ ] Package installed
- [ ] `.component-schema.yaml` created with `componentsDir`
- [ ] Storyblok credentials set (config file or `.env.local`)
- [ ] `npx storyblok-component-schema plan` runs successfully
