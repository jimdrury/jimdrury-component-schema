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
| `image` | `string` (URL) | no | Preview image URL for the component picker. |
| `preview_field` | `string` | no | Name of the field used as the preview title in the UI. |
| `folder` | `string` | no | Component group / folder path (e.g. `content`, `layout`). |
| `tags` | `string[]` | no | Internal tags for filtering and block restrictions. |
| `schema` | `FieldType[]` | yes | Array of field definitions. Field names must be unique. |

---

## Output

Calling `contentType()` returns an object with `is_root: true`, which tells Storyblok this component can be used as a story root.

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
- [Field types](../readme.md#field-types) -- full list of available fields
