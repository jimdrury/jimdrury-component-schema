# Content Type

[< Back to overview](../readme.md)

---

A **content type** is a root-level component. It represents a top-level entry in Storyblok -- things like pages, blog posts, or site-wide settings. Content types can be created directly in the content tree and serve as the starting point for a story.

```ts
import { contentType } from "@jimdrury/storyblok-component-schema";
```

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Unique machine name. Lowercase letters and underscores only. |
| `display_name` | `string` | yes | Human-readable label shown in the Storyblok UI. |
| `description` | `string` | no | Description shown to editors in the component picker. |
| `image` | `string` (URL) | no | Preview image URL for the component picker. |
| `preview_field` | `string` | no | Name of the field used as the preview title in the UI. |
| `preview_tmpl` | `string` | no | Template for the block preview in the editor. |
| `icon` | `string` | no | Icon shown in the component picker. |
| `color` | `string` | no | Colour of the component picker icon (hex value). |
| `content_type_asset_preview` | `string` | no | Name of an `asset` field shown as the story's preview image. Must name an `asset` field in `schema`. |
| `folder` | `string` | no | Component group / folder path (e.g. `content`, `layout`). |
| `tags` | `string[]` | no | Internal tags for filtering and block restrictions. |
| `schema` | `FieldType[]` | yes | Array of field definitions. Field names must be unique. |

---

## Output

Calling `contentType()` returns an object with `is_root: true` and `is_nestable: false`, which tells Storyblok this component can only be used as a story root, not as a nested block inside another component.

---

## Examples

### Minimal

```ts
import { contentType, text } from "@jimdrury/storyblok-component-schema";

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
import { contentType, blocks, text, richtext, datetime, option } from "@jimdrury/storyblok-component-schema";

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
        blocks({
            name: 'sections',
            disallowed_tags: ['layout'],
        }),
    ],
});
```

---

## See also

- [Nestable](./nestable.md) -- for reusable, embeddable blocks
- [Universal](./universal.md) -- for root-level components that can also be embedded
- [Field types](../readme.md#field-types) -- full list of available fields
