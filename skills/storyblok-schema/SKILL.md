---
name: storyblok-schema
description: Creates, changes, reviews, and validates Storyblok component schemas with @jimdrury/storyblok-component-schema. Use when adding page, blok, or universal Storyblok components, choosing or configuring schema fields, installing the package, or planning/applying Storyblok schema changes.
---

# Storyblok Schema

Use progressive disclosure: read this file first, then only the reference files needed for the task. Do not load every field guide.

## Folders

Each directory under the components directory (`schema/` by default) maps to
a Storyblok component folder of the same name, and every component sets
`folder` to its directory path:

- `schema/<name>.ts` → no `folder`
- `schema/layout/<name>.ts` → `folder: "layout"`
- `schema/layout/grids/<name>.ts` → `folder: "layout/grids"`

`apply` deletes any Storyblok component folder that no local component uses,
and any Storyblok component that has no local file, so always keep `folder`
and the file location in step and keep every component under source control.

## Workflow

1. Inspect the existing component files and `.component-schema.yaml` when relevant.
2. For a new component, ask the user whether it is a page, blok, or universal
   component unless the request already says so. See
   [references/component-kinds.md](references/component-kinds.md).
3. Identify the fields needed.
4. Read the scenario-specific references below.
5. Make the smallest compatible schema change.
6. Type-check the project, then run `npx storyblok-component-schema plan` when credentials are available.
7. Run `npx storyblok-component-schema apply` only when the user explicitly asks to update the Storyblok space.
8. When fields or component names changed, update the code that renders the component.

Field and component names must use lowercase letters and underscores. Field names must be unique across the entire component, including fields inside `tab()` calls.

## Read the right reference

### Set up or diagnose the schema package

- Package registry, config, credentials, and CLI resolution: [references/install.md](references/install.md)

### Create or change a component

Read [references/create-component.md](references/create-component.md) first for the authoring workflow, conventions, validation rules, and a field overview.

Then read [references/component-kinds.md](references/component-kinds.md) to
confirm the kind with the user, and the matching builder guide:

- Page component (built from `contentType()`): [references/content-type.md](references/content-type.md)
- Blok component (built from `nestable()`): [references/nestable.md](references/nestable.md)
- Universal component (built from `universal()`): [references/universal.md](references/universal.md)

For complete factory parameters across all field types, read [references/create-component-reference.md](references/create-component-reference.md).

### Choose or configure a field

- Single-line string, heading, title, slug: [references/text.md](references/text.md)
- Multiline unformatted text: [references/textarea.md](references/textarea.md)
- WYSIWYG content: [references/richtext.md](references/richtext.md)
- Markdown source: [references/markdown.md](references/markdown.md)
- Numeric values: [references/number.md](references/number.md)
- Date or date/time: [references/datetime.md](references/datetime.md)
- Toggle or checkbox: [references/boolean.md](references/boolean.md)
- One selection: [references/option.md](references/option.md)
- Multiple selections: [references/options.md](references/options.md)
- Nested Storyblok components: [references/blocks.md](references/blocks.md)
- Internal, external, email, or asset link: [references/multilink.md](references/multilink.md)
- One image or file: [references/asset.md](references/asset.md)
- Image gallery or file collection: [references/multiasset.md](references/multiasset.md)
- References to published stories: [references/references.md](references/references.md)
- Group editor fields in a tab: [references/tab.md](references/tab.md)
- Editable spreadsheet-like data: [references/table.md](references/table.md)
- Storyblok Code Block plugin field: [references/plugincodeblock.md](references/plugincodeblock.md)

## Guardrails

- Import only the factories used by the schema file.
- Ask whether a new component is a page, blok, or universal component before
  creating it.
- Default-export each definition from its builder: `contentType()` for a page,
  `nestable()` for a blok, `universal()` for a universal component.
- Set `folder` to the file's directory under the components directory.
- Treat the file as the full definition: `apply` clears any optional setting
  (`description`, `image`, `preview_field`, `preview_tmpl`, `icon`, `color`,
  `content_type_asset_preview`, `folder`, `tags`) the file leaves out, and
  reverts settings changed in the Storyblok UI.
- Use only one block restriction strategy per `blocks()` field.
- Prefer `plan` before an `apply`. Treat an `apply` as an external write.
