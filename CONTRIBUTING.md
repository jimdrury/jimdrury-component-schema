# Contributing

## Getting started

1. Fork and clone the repository.
2. Install dependencies:

```bash
yarn install
```

3. Create a `.env.local` with your Storyblok credentials:

```
STORYBLOK_API_TOKEN=your-management-api-token
STORYBLOK_SPACE_ID=your-space-id
```

4. Run tests:

```bash
yarn test
```

## Development workflow

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

Two GitHub Actions workflows automate quality checks and publishing.

### Pull requests (`ci.yml`)

Every pull request runs **lint**, **build**, and **test**. Test results are reported as a check on the PR.

### Merging to main (`deploy.yml`)

When a PR is merged to `main`:

1. **Lint & Test** -- verifies the code is clean.
2. **Publish** -- builds and publishes `@jimdrury/storyblok-component-schema` to the GitHub Package Registry. Already-published versions are skipped.

## Pull requests

1. Create a feature branch from `main`.
2. Make your changes in small, focused commits.
3. Make sure `yarn lint` and `yarn test` pass before pushing.
4. Open a pull request against `main` with a clear description of the change.

## Reporting issues

If you find a bug or have a feature request, please [open an issue](https://github.com/jimdrury/jimdrury-component-schema/issues).
