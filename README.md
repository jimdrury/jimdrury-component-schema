# Component Schema

A TypeScript DSL and CLI for managing Storyblok components as code.

```bash
npm install @jimdrury/storyblok-component-schema
```

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
