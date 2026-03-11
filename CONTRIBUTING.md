# Contributing

## Getting started

1. Fork and clone the repository.
2. Install dependencies:

```bash
yarn install
```

3. Copy the example environment file and add your Storyblok credentials:

```bash
cp .env.example .env.local
```

4. Run tests:

```bash
yarn test
```

## Development workflow

### Adding or updating components

Component definitions live in `components/`. Each file exports a default call to `contentType()` or `nestable()`. See the [docs](./docs/readme.md) for the full API reference.

### Running locally

```bash
# Preview changes without modifying Storyblok
yarn plan

# Apply changes to your Storyblok space
yarn apply
```

### Linting and formatting

This project uses [Biome](https://biomejs.dev) for linting and formatting:

```bash
# Check for lint and format issues
yarn lint

# Auto-fix issues
yarn lint:fix
```

### Running tests

```bash
# Single run
yarn test

# Watch mode
yarn test:watch
```

## CI/CD

Two GitHub Actions workflows automate linting, testing, and deployment.

### Pull requests (`ci.yml`)

Every pull request runs **lint**, **test**, and **plan**. The Storyblok plan output is posted as a sticky comment on the PR so reviewers can see exactly what would change.

### Merging to main (`deploy.yml`)

When a PR is merged to `main`:

1. **Plan** — runs `yarn plan` and captures the diff.
2. **Apply** — gated behind the `production` environment, which requires manual approval. A reviewer must click "Approve" in the GitHub Actions UI before changes are pushed to Storyblok.
3. **Release** — after apply succeeds a GitHub Release is created with the plan details in the release notes. The version tag is auto-incremented based on the type of changes:
   - Deletes → major bump
   - Creates (no deletes) → minor bump
   - Updates only → patch bump

If the plan reports no changes, the apply and release steps are skipped entirely.

### Required setup

The following must be configured in the GitHub repository settings:

- **Secrets** (`Settings > Secrets and variables > Actions`):
  - `STORYBLOK_API_TOKEN` — Storyblok Management API token
  - `STORYBLOK_SPACE_ID` — target Storyblok space ID
- **Environment** (`Settings > Environments`):
  - Create an environment named `production` with **Required reviewers** enabled.

## Pull requests

1. Create a feature branch from `main`.
2. Make your changes in small, focused commits.
3. Make sure `yarn lint` and `yarn test` pass before pushing.
4. Open a pull request against `main` with a clear description of the change.

## Reporting issues

If you find a bug or have a feature request, please [open an issue](https://github.com/jimdrury/jimdrury-component-schema/issues).
