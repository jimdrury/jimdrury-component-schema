# blocks

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Nested component blocks. This is the field type that lets editors add, reorder, and remove [nestable](../component-type/nestable.md) components inside a story. It powers the block-based editing experience in Storyblok.

```ts
import { blocks } from "~/schema/field-type";
```

---

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Field key. Lowercase letters and underscores only. |
| `description` | `string` | no | Help text shown to editors. |
| `tooltip` | `boolean` | no | Show the description as a tooltip. |
| `required` | `boolean` | no | Mark the field as required. |

### Specific

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `minimum` | `number` | -- | Minimum number of blocks required. |
| `maximum` | `number` | -- | Maximum number of blocks allowed. |

### Restrictions

You can restrict **which** nestable components are allowed in this blocks field. Only **one** restriction type can be used at a time -- they are mutually exclusive.

| Parameter | Type | Description |
|-----------|------|-------------|
| `allowed_components` | `ComponentRef[]` | Only these components can be added. |
| `allowed_folders` | `string[]` | Only components in these folders can be added. |
| `allowed_tags` | `string[]` | Only components with these tags can be added. |
| `disallowed_components` | `ComponentRef[]` | These components are excluded. |
| `disallowed_folders` | `string[]` | Components in these folders are excluded. |
| `disallowed_tags` | `string[]` | Components with these tags are excluded. |

A `ComponentRef` is any object with a `name` property -- typically another component's default export.

---

## How restrictions work

The sync engine resolves tag names and folder paths to their Storyblok IDs automatically. You reference them by their human-readable names in code, and the push process handles the rest.

Providing more than one restriction type will throw a validation error. Pick the approach that best fits your use case:

- **By component** -- when you know exactly which blocks are allowed.
- **By folder** -- when you want to allow all blocks in a component group.
- **By tag** -- when you've tagged related blocks and want to filter by category.

---

## Examples

### Unrestricted

```ts
blocks({ name: 'body' })
```

### With min/max

```ts
blocks({
    name: 'sections',
    minimum: 1,
    maximum: 10,
    required: true,
})
```

### Restrict by tag

```ts
blocks({
    name: 'content',
    disallowed_tags: ['layout'],
})
```

### Restrict by specific components

```ts
import hero from "./hero";
import card from "./card";

blocks({
    name: 'highlights',
    allowed_components: [hero, card],
    maximum: 3,
})
```

### Restrict by folder

```ts
blocks({
    name: 'widgets',
    allowed_folders: ['ui'],
})
```

---

## See also

- [Nestable](../component-type/nestable.md) -- the component type that blocks embed
- [Content Type](../component-type/content-type.md) -- root-level components that typically contain blocks fields
