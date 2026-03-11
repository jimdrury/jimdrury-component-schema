# Component Schema

Define Storyblok components as TypeScript code. Preview and apply changes with a Terraform-style workflow.

```
components/blog.ts  -->  yarn plan   -->  review changes
                    -->  yarn apply  -->  Storyblok
```

Instead of clicking through the Storyblok UI to configure components, you write them as plain `.ts` files inside the `components/` directory. Each file exports a component definition built from two simple concepts:

- **Component types** define _what kind_ of component it is (a content type or a nestable block).
- **Field types** define _what data_ the component holds (text, images, links, etc.).

Every parameter is validated at build time with Zod and at the type level with TypeScript, so misconfigurations are caught before they ever reach the API.

## Quick start

```bash
# Install dependencies
yarn install

# Copy the example env file and fill in your credentials
cp .env.example .env.local

# Preview what would change in your Storyblok space
yarn plan

# Apply changes
yarn apply
```

## Documentation

Full documentation lives in the [`docs/`](./docs) directory:

- [Overview & API reference](./docs/readme.md) — component types, field types, and base parameters.
- [Setup](./docs/setup.md) — environment variables, commands, and detailed usage.

## [Contributing](./CONTRIBUTING.md)

## [License (MIT)](./LICENSE)
