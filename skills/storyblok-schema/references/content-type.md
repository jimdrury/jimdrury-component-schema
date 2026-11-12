---
name: content-type
description: >-
  Use the contentType() factory to define Storyblok page components
  (content types) like pages, articles, or settings. Use when creating a new
  page component or configuring its schema, folder, tags, or preview settings.
---

# contentType

A content type is a page component representing a top-level entry in Storyblok -- pages, blog posts, settings, etc. It can only be a story root.

## Import

```ts
import { contentType } from "@jimdrury/storyblok-component-schema";
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
| `folder`        | `string`       | no       | Component group / folder path (e.g. `content`, `layout`).    |
| `tags`          | `string[]`     | no       | Internal tags for filtering and block restrictions.          |
| `schema`        | `FieldType[]`  | yes      | Array of field definitions. Field names must be unique.      |

Returns an object with `is_root: true` and `is_nestable: false`. This is a
page component: editors create stories from it, and it cannot be placed in a
`blocks()` field. For a component that is both, use
[universal.md](universal.md); see [component-kinds.md](component-kinds.md).

## Examples

### Minimal

```ts
import { contentType, text } from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "article",
  display_name: "Article",
  schema: [text({ name: "title", required: true })],
});
```

### Full-featured

```ts
import {
  contentType,
  blocks,
  text,
  richtext,
  datetime,
  option,
} from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "page",
  display_name: "Page",
  folder: "content",
  preview_field: "title",
  schema: [
    text({ name: "title", required: true }),
    richtext({ name: "body" }),
    datetime({ name: "published_at", disable_time: true }),
    option({
      name: "status",
      options: [
        { name: "Draft", value: "draft" },
        { name: "Published", value: "published" },
      ],
      default_value: "draft",
    }),
    blocks({ name: "sections", disallowed_tags: ["layout"] }),
  ],
});
```
