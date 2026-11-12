# Universal

[< Back to overview](../readme.md)

---

A **universal** component works as both a content type and a nestable block. Editors can create stories from it, and it can be embedded inside other components via a [blocks](../field-type/blocks.md) field. Use it for entries that are managed on their own but also reused inline, such as FAQs or snippets.

```ts
import { universal } from "@jimdrury/storyblok-component-schema";
```

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Unique machine name. Lowercase letters and underscores only. |
| `display_name` | `string` | yes | Human-readable label shown in the Storyblok UI. |
| `image` | `string` (URL) | no | Preview image URL for the component picker. |
| `preview_field` | `string` | no | Name of the field used as the preview title in the UI. |
| `preview_tmpl` | `string` | no | Template for the block preview in the editor. |
| `icon` | `string` | no | Icon shown in the component picker. |
| `color` | `string` | no | Colour of the component picker icon (hex value). |
| `content_type_asset_preview` | `string` | no | Name of an `asset` field shown as the story's preview image. Must name an `asset` field in `schema`. |
| `folder` | `string` | no | Component group / folder path (e.g. `content`, `ui`). |
| `tags` | `string[]` | no | Internal tags for filtering and block restrictions. |
| `schema` | `FieldType[]` | yes | Array of field definitions. Field names must be unique. |

---

## Output

Calling `universal()` returns an object with `is_root: true` and `is_nestable: true`, which tells Storyblok this component can be used both as a story root and as a nested block inside another component.

---

## Examples

### Minimal

```ts
import { universal, text } from "@jimdrury/storyblok-component-schema";

export default universal({
    name: 'snippet',
    display_name: 'Snippet',
    schema: [
        text({ name: 'content', required: true }),
    ],
});
```

### Full-featured

```ts
import { universal, text, richtext } from "@jimdrury/storyblok-component-schema";

export default universal({
    name: 'faq',
    display_name: 'FAQ',
    folder: 'content',
    tags: ['content'],
    preview_field: 'question',
    schema: [
        text({ name: 'question', required: true }),
        richtext({ name: 'answer', required: true }),
    ],
});
```

---

## See also

- [Content Type](./content-type.md) -- for components that can only be a story root
- [Nestable](./nestable.md) -- for components that can only be nested
- [blocks](../field-type/blocks.md) -- the field type that embeds nestable and universal components
