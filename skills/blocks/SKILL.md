---
name: blocks
description: >-
  Use the blocks() factory for nested component block fields. Controls which
  nestable components editors can add, reorder, and remove.
---

# blocks

Nested block field: editors add, reorder, and remove child components (nestable types).

## Import

```ts
import { blocks } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Field is required. |

### Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minimum` | `number` | No | Minimum number of blocks. |
| `maximum` | `number` | No | Maximum number of blocks. |

### Restriction (mutually exclusive sets)

Pick one coherent allow-list or deny-list strategy; do not mix conflicting rules arbitrarily.

| Parameter | Type | Description |
|-----------|------|-------------|
| `allowed_components` | `ComponentRef[]` | Only these components may be added. |
| `allowed_folders` | `string[]` | Only components in these folders. |
| `allowed_tags` | `string[]` | Only components with these tags. |
| `disallowed_components` | `ComponentRef[]` | These components cannot be added. |
| `disallowed_folders` | `string[]` | Components in these folders cannot be added. |
| `disallowed_tags` | `string[]` | Components with these tags cannot be added. |

A **ComponentRef** is any object with a `name` property (typically another component’s default export).

## Examples

```ts
blocks({ name: 'body' });
```

```ts
blocks({ name: 'sections', minimum: 1, maximum: 10 });
```

```ts
blocks({ name: 'content', disallowed_tags: ['layout'] });
```

```ts
blocks({ name: 'widgets', allowed_folders: ['ui'] });
```

```ts
import hero from './hero';

blocks({ name: 'highlights', allowed_components: [hero] });
```
