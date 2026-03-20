---
name: textarea
description: >-
  Use the textarea() factory for multi-line plain text fields like descriptions
  or bios. Use when defining Storyblok schema fields.
---

# textarea

Multi-line plain text for descriptions, bios, and long unformatted copy.

## Import

```ts
import { textarea } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `default_value` | no | `string` | Default string value. |
| `max_length` | no | `number` | Maximum character length. |

## Examples

```ts
textarea({ name: 'summary' });
```

```ts
textarea({ name: 'bio', required: true, max_length: 500 });
```
