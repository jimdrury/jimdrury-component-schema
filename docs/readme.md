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

See [Setup](./setup.md) for installation, environment variables, and available commands.

---

## Project structure

```
components/          Component definitions (one file per component)
src/
  cli.ts             CLI entry point (plan / apply commands)
  plan.ts            Computes the diff between local and remote state
  apply.ts           Executes a plan against the Storyblok API
  format.ts          Terraform-style terminal output formatting
  discover.ts        Auto-discovers components/*.ts at runtime
  env.ts             Loads and validates environment variables
  api/               Storyblok Management API client
  schema/
    component-type/  contentType() and nestable() factories
    field-type/      text(), blocks(), asset(), etc.
```

---

## Defining a component

A component file exports a default call to either `contentType()` or `nestable()`:

```ts
import { contentType } from "~/schema/component-type";
import { text, richtext } from "~/schema/field-type";

export default contentType({
    name: 'blog',
    display_name: 'Blog',
    folder: 'content',
    schema: [
        text({ name: 'title', required: true }),
        richtext({ name: 'content' }),
    ],
});
```

The `schema` array accepts any combination of field types. Field names are validated to be unique at the type level — the compiler will catch duplicates before you run anything.

---

## Component types

Choose the right wrapper for each component:

| Type | Factory | Use for |
|------|---------|---------|
| [Content Type](./component-type/content-type.md) | `contentType()` | Root-level entries: pages, articles, settings |
| [Nestable](./component-type/nestable.md) | `nestable()` | Reusable blocks: grids, cards, heroes |

---

## Field types

Each field type maps directly to a Storyblok field. All fields share a set of [base parameters](#base-parameters), plus their own specific options.

| Field | Import | Storyblok type | Description |
|-------|--------|----------------|-------------|
| [text](./field-type/text.md) | `text()` | `text` | Single-line text input |
| [textarea](./field-type/textarea.md) | `textarea()` | `textarea` | Multi-line plain text |
| [richtext](./field-type/richtext.md) | `richtext()` | `richtext` | Visual rich text editor |
| [markdown](./field-type/markdown.md) | `markdown()` | `markdown` | Markdown editor |
| [number](./field-type/number.md) | `number()` | `number` | Numeric input |
| [datetime](./field-type/datetime.md) | `datetime()` | `datetime` | Date and time picker |
| [boolean](./field-type/boolean.md) | `boolean()` | `boolean` | Toggle / checkbox |
| [option](./field-type/option.md) | `option()` | `option` | Single-select dropdown |
| [options](./field-type/options.md) | `options()` | `options` | Multi-select dropdown |
| [blocks](./field-type/blocks.md) | `blocks()` | `bloks` | Nested component blocks |
| [multilink](./field-type/multilink.md) | `multilink()` | `multilink` | Link (internal, external, email, asset) |
| [asset](./field-type/asset.md) | `asset()` | `asset` | Single file / image |
| [multiasset](./field-type/multiasset.md) | `multiasset()` | `multiasset` | Multiple files / images |
| [tab](./field-type/tab.md) | `tab()` | `tab` | Group fields into editor tabs |
| [table](./field-type/table.md) | `table()` | `table` | Editable table |
| [references](./field-type/references.md) | `references()` | `options` | Story references (internal stories) |

---

## Base parameters

Every field type accepts these common parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Field key. Lowercase letters and underscores only. |
| `description` | `string` | no | Help text shown to editors. |
| `tooltip` | `boolean` | no | Show the description as a tooltip instead of inline. |
| `required` | `boolean` | no | Mark the field as required. |

These are documented on each field type page as well, but only listed once here to keep things concise.
