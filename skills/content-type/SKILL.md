---
name: content-type
description: >-
  Use the contentType() factory to define root-level Storyblok components
  like pages, articles, or settings. Use when creating a new content type
  or configuring its schema, folder, tags, or preview settings.
---

# contentType

A content type is a root-level component representing a top-level entry in Storyblok -- pages, blog posts, settings, etc.

## Import

```ts
import { contentType } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Unique machine name. Lowercase letters and underscores only. |
| `display_name` | `string` | yes | Human-readable label shown in the Storyblok UI. |
| `image` | `string` (URL) | no | Preview image URL for the component picker. |
| `preview_field` | `string` | no | Name of the field used as the preview title in the UI. |
| `folder` | `string` | no | Component group / folder path (e.g. `content`, `layout`). |
| `tags` | `string[]` | no | Internal tags for filtering and block restrictions. |
| `schema` | `FieldType[]` | yes | Array of field definitions. Field names must be unique. |

Returns an object with `is_root: true`.

## Examples

### Minimal

```ts
import { contentType, text } from '@jimdrury/storyblok-component-schema';

export default contentType({
    name: 'article',
    display_name: 'Article',
    schema: [
        text({ name: 'title', required: true }),
    ],
});
```

### Full-featured

```ts
import { contentType, blocks, text, richtext, datetime, option } from '@jimdrury/storyblok-component-schema';

export default contentType({
    name: 'page',
    display_name: 'Page',
    folder: 'content',
    preview_field: 'title',
    schema: [
        text({ name: 'title', required: true }),
        richtext({ name: 'body' }),
        datetime({ name: 'published_at', disable_time: true }),
        option({
            name: 'status',
            options: [
                { name: 'Draft', value: 'draft' },
                { name: 'Published', value: 'published' },
            ],
            default_value: 'draft',
        }),
        blocks({ name: 'sections', disallowed_tags: ['layout'] }),
    ],
});
```
