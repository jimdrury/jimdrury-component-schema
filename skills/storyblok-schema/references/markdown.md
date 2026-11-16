---
name: markdown
description: >-
  Use the markdown() factory for markdown editor fields. Use when defining
  Storyblok schema fields.
---

# markdown

Markdown source edited in Storyblok’s markdown field type.

## Import

```ts
import { markdown } from "@jimdrury/storyblok-component-schema";
```

## Parameters

| Parameter       | Required | Type      | Description                               |
| --------------- | -------- | --------- | ----------------------------------------- |
| `name`          | yes      | `string`  | Field key in the schema.                  |
| `description`   | no       | `string`  | Help text shown in the editor.            |
| `tooltip`       | no       | `boolean` | Show the description as a tooltip.        |
| `required`      | no       | `boolean` | Whether the field is required.            |
| `conditional_settings` | no | `ConditionalSetting[]` | Hide the field or change whether it is required, based on a sibling field. See [conditional-settings.md](conditional-settings.md). |
| `max_length`    | no       | `number`  | Maximum character length.                 |
| `rich_markdown` | no       | `boolean` | Enable rich markdown mode when supported. |

## Examples

```ts
markdown({ name: "content" });
```

```ts
markdown({ name: "readme", rich_markdown: true });
```
