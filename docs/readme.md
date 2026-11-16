# Component Schema

Define Storyblok components as TypeScript code. Preview and apply changes with a Terraform-style workflow.

```
schema/blog.ts  -->  yarn plan   -->  review changes
                -->  yarn apply  -->  Storyblok
```

Instead of clicking through the Storyblok UI to configure components, you write them as plain `.ts` files inside the `schema/` directory. Each file exports a component definition built from two simple concepts:

- **Component types** define _what kind_ of component it is (a content type, a nestable block, or a universal component that is both).
- **Field types** define _what data_ the component holds (text, images, links, etc.).

Every parameter is validated at build time with Zod and at the type level with TypeScript, so misconfigurations are caught before they ever reach the API.

See [Setup](./setup.md) for installation, environment variables, and available commands.

---

## Project structure

```
schema/                  Component definitions (one file per component)
src/
  index.ts               Public barrel (re-exports everything)
  bin.ts                 CLI entry point (plan / apply commands)
  schema/
    component-type/      contentType(), nestable(), and universal() factories
    field-type/          text(), blocks(), asset(), etc.
    component-definition.ts
  cli/
    plan.ts              Computes the diff between local and remote state
    apply.ts             Executes a plan against the Storyblok API
    format.ts            Terraform-style terminal output formatting
    discover.ts          Auto-discovers schema/*.ts at runtime
    env.ts               Loads and validates environment variables
    payload.ts           Converts definitions to Storyblok API payloads
    api/                 Storyblok Management API client
```

---

## Defining a component

A component file exports a default call to `contentType()`, `nestable()`, or `universal()`:

```ts
import { contentType, text, richtext } from "@jimdrury/storyblok-component-schema";

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
| [Universal](./component-type/universal.md) | `universal()` | Both: entries that are also reused as blocks, such as FAQs |

Each file is the full definition of its component. Any optional setting a file leaves out (such as `description`, `preview_field`, `icon`, `folder`, or `tags`) is cleared in Storyblok on `apply`, and settings changed in the Storyblok UI show up in `plan`.

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
| [pluginCodeBlock](./field-type/plugin-code-block.md) | `pluginCodeBlock()` | `custom` | Code block (Storyblok Code Block plugin) |

---

## Base parameters

Every field type accepts these common parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Field key. Lowercase letters and underscores only. |
| `description` | `string` | no | Help text shown to editors. |
| `tooltip` | `boolean` | no | Show the description as a tooltip instead of inline. |
| `required` | `boolean` | no | Mark the field as required. |
| `conditional_settings` | `ConditionalSetting[]` | no | Hide the field or change whether it is required, based on a sibling field. See [Conditional settings](#conditional-settings). |

These are documented on each field type page as well, but only listed once here to keep things concise.

---

## Conditional settings

`conditional_settings` hides a field, or changes whether it is required, based on the value of a sibling field. It uses Storyblok's own shape, so a rule saved in the editor can be copied into the schema file as-is.

```ts
number({
    name: 'minutes',
    conditional_settings: [
        {
            rule_match: 'any',
            rule_conditions: [
                {
                    validated_object: {
                        type: 'field',
                        field_key: 'minutes_unlimited',
                        field_attr: 'value',
                    },
                    validation: 'equals',
                    value: true,
                },
            ],
            modifications: [{ display: 'hide' }],
        },
    ],
}),
boolean({ name: 'minutes_unlimited' }),
```

| Key | Type | Description |
|-----|------|-------------|
| `rule_match` | `'all' \| 'any'` | Whether every condition must match, or any one of them. |
| `rule_conditions` | `RuleCondition[]` | At least one condition on a sibling field. |
| `modifications` | `Modification[]` | At least one of `{ display: 'hide' \| 'hidden' }` or `{ required: boolean }`. |

Each condition's `validation` decides its `value`:

| `validation` | `value` |
|--------------|---------|
| `equals`, `not_equals` | A string, number, boolean, or asset object. |
| `empty`, `not_empty` | Omitted or `null`. |
| `gt`, `lt` | A number, or a `YYYY-MM-DD HH:mm` date string. |

The component builder throws when `field_key` names an unknown field, a tab, or the field itself.

The Storyblok editor writes and reads only the first setting and the first modification, so write one of each. The editor understands `display: 'hide'`, but the server's required check only recognizes `'hidden'`: a field with `required: true` and a `hide` rule is still required on save while it is hidden.

`plan` always compares `conditional_settings`, including rules set only in Storyblok. A field without `conditional_settings` has no rules, so `apply` removes any rule added in the editor.
