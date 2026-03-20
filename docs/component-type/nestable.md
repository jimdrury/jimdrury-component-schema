# Nestable

[< Back to overview](../readme.md)

---

A **nestable** component is a reusable block that can be embedded inside other components via a [blocks](../field-type/blocks.md) field. Nestables cannot exist on their own in the content tree -- they always live inside a parent story. Use them for UI primitives like grids, cards, heroes, or any repeatable content structure.

```ts
import { nestable } from "@jimdrury/storyblok-component-schema";
```

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Unique machine name. Lowercase letters and underscores only. |
| `display_name` | `string` | yes | Human-readable label shown in the Storyblok UI. |
| `image` | `string` (URL) | no | Preview image URL for the component picker. |
| `preview_field` | `string` | no | Name of the field used as the preview title in the UI. |
| `folder` | `string` | no | Component group / folder path (e.g. `layout`, `ui`). |
| `tags` | `string[]` | no | Internal tags for filtering and block restrictions. |
| `schema` | `FieldType[]` | yes | Array of field definitions. Field names must be unique. |

---

## Output

Calling `nestable()` returns an object with `is_root: false` and `is_nestable: true`, which tells Storyblok this component can only be used as a nested block inside another component.

---

## Tags

Tags are particularly useful on nestable components. A tag like `layout` lets you group related blocks together and use tag-based restrictions in [blocks](../field-type/blocks.md) fields to control which nestables are allowed in a given slot.

```ts
export default nestable({
    name: 'grid',
    display_name: 'Grid',
    folder: 'layout',
    tags: ['layout'],
    schema: [ /* ... */ ],
});
```

A `blocks` field on a parent component could then restrict itself to only layout-tagged blocks, or exclude them:

```ts
blocks({ name: 'body', disallowed_tags: ['layout'] })
```

---

## Examples

### Minimal

```ts
import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
    name: 'text_block',
    display_name: 'Text Block',
    schema: [
        text({ name: 'content', required: true }),
    ],
});
```

### Full-featured

```ts
import { nestable, blocks, multilink, asset, option } from "@jimdrury/storyblok-component-schema";

export default nestable({
    name: 'grid',
    display_name: 'Grid',
    folder: 'layout',
    tags: ['layout'],
    schema: [
        blocks({ name: 'children', disallowed_tags: ['layout'] }),
        multilink({ name: 'link' }),
        asset({ name: 'background' }),
        option({
            name: 'columns',
            description: 'Number of columns',
            options: [
                { name: '1', value: '1' },
                { name: '2', value: '2' },
                { name: '3', value: '3' },
            ],
            default_value: '2',
        }),
    ],
});
```

---

## See also

- [Content Type](./content-type.md) -- for root-level components
- [blocks](../field-type/blocks.md) -- the field type that embeds nestable components
