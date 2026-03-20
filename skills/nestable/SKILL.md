---
name: nestable
description: >-
  Use the nestable() factory to define reusable Storyblok blocks that can
  be embedded inside other components via blocks() fields. Use when creating
  a new nestable component like a card, hero, or grid.
---

# nestable

A nestable component is a reusable block that can be embedded inside other components via a blocks() field. Nestables cannot exist on their own -- they always live inside a parent story.

## Import

```ts
import { nestable } from '@jimdrury/storyblok-component-schema';
```

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

Returns an object with `is_root: false` and `is_nestable: true`.

## Tags

Tags are useful on nestable components for block restrictions:

```ts
export default nestable({
    name: 'grid',
    display_name: 'Grid',
    folder: 'layout',
    tags: ['layout'],
    schema: [ /* ... */ ],
});
```

A blocks() field can then filter by tag:

```ts
blocks({ name: 'body', disallowed_tags: ['layout'] })
```

## Examples

### Minimal

```ts
import { nestable, text } from '@jimdrury/storyblok-component-schema';

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
import { nestable, blocks, multilink, asset, option } from '@jimdrury/storyblok-component-schema';

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
