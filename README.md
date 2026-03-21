# Component Schema

A TypeScript DSL and CLI for managing Storyblok components as code.

## Installation

This package is published to the [GitHub Package Registry](https://github.com/jimdrury/jimdrury-component-schema/packages), not npm. You need to tell your package manager where to find `@jimdrury` scoped packages.

### npm / Yarn 1

Add a `.npmrc` to your project root:

```
@jimdrury:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @jimdrury/storyblok-component-schema
# or
yarn add @jimdrury/storyblok-component-schema
```

### Yarn 2+ (Berry)

Add to your `.yarnrc.yml`:

```yaml
npmScopes:
  jimdrury:
    npmRegistryServer: https://npm.pkg.github.com
```

Then install:

```bash
yarn add @jimdrury/storyblok-component-schema
```

## Usage

Define components as plain `.ts` files, then use the CLI to preview and apply changes to your Storyblok space:

```ts
import { contentType, text, richtext } from '@jimdrury/storyblok-component-schema';

export default contentType({
    name: 'blog',
    display_name: 'Blog',
    schema: [
        text({ name: 'title', required: true }),
        richtext({ name: 'content' }),
    ],
});
```

Configure your project with a `.component-schema.yaml`:

```yaml
componentsDir: ./schema
storyblok:
  apiToken: "${STORYBLOK_API_TOKEN}"
  spaceId: "${STORYBLOK_SPACE_ID}"
```

Then run the CLI:

```bash
npx storyblok-component-schema plan     # preview changes
npx storyblok-component-schema apply    # apply to Storyblok
```

## Documentation

Full documentation lives in the [`docs/`](./docs) directory:

- [Overview & API reference](./docs/readme.md) -- component types, field types, and base parameters.
- [Setup](./docs/setup.md) -- environment variables, commands, and detailed usage.

## [Contributing](./CONTRIBUTING.md)

## [License (MIT)](./LICENSE)
