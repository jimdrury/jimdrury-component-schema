---
name: universal
description: >-
  Use the universal() factory to define Storyblok components that editors can
  create stories from and also place inside blocks() fields. Use when creating
  a new universal component like an FAQ, snippet, or reusable entry.
---

# universal

A universal component works as both a page and a blok: editors can create a story from it, and it can be embedded inside other components via a blocks() field.

## Import

```ts
import { universal } from "@jimdrury/storyblok-component-schema";
```

## Parameters

| Parameter       | Type           | Required | Description                                                  |
| --------------- | -------------- | -------- | ------------------------------------------------------------ |
| `name`          | `string`       | yes      | Unique machine name. Lowercase letters and underscores only. |
| `display_name`  | `string`       | yes      | Human-readable label shown in the Storyblok UI.              |
| `description` | `string` | no | Description shown to editors in the component picker. |
| `image`         | `string` (URL) | no       | Preview image URL for the component picker.                  |
| `preview_field` | `string`       | no       | Name of the field used as the preview title in the UI.       |
| `preview_tmpl` | `string` | no | Template for the block preview in the editor. |
| `icon` | `string` | no | Icon shown in the component picker. |
| `color` | `string` | no | Colour of the component picker icon (hex value). |
| `content_type_asset_preview` | `string` | no | Name of an `asset` field shown as the story's preview image. Must name an `asset` field in `schema`. |
| `folder`        | `string`       | no       | Component group / folder path (e.g. `content`, `ui`).        |
| `tags`          | `string[]`     | no       | Internal tags for filtering and block restrictions.          |
| `schema`        | `FieldType[]`  | yes      | Array of field definitions. Field names must be unique.      |

Returns an object with `is_root: true` and `is_nestable: true`. Because it
can render in either position, its renderer must not assume it is the page
root; see [component-kinds.md](component-kinds.md).

## Examples

### Minimal

```ts
import { text, universal } from "@jimdrury/storyblok-component-schema";

export default universal({
  name: "snippet",
  display_name: "Snippet",
  schema: [text({ name: "content", required: true })],
});
```

### Full-featured

```ts
import {
  richtext,
  text,
  universal,
} from "@jimdrury/storyblok-component-schema";

export default universal({
  name: "faq",
  display_name: "FAQ",
  folder: "content",
  tags: ["content"],
  preview_field: "question",
  schema: [
    text({ name: "question", required: true }),
    richtext({ name: "answer", required: true }),
  ],
});
```
