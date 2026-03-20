---
name: text
description: >-
  Use the text() factory for single-line text input fields like titles,
  headings, or slugs. Use when defining Storyblok schema fields.
---

# text

Single-line text input for titles, headings, slugs, and similar values.

## Import

```ts
import { text } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `translatable` | no | `boolean` | Enable translation for this field. |
| `default_value` | no | `string` | Default string value. |
| `max_length` | no | `number` | Maximum character length. |
| `regex` | no | `string` | Validation pattern (e.g. slug rules). |

## Examples

```ts
text({ name: 'title', required: true });
```

```ts
text({ name: 'slug', max_length: 80, regex: '^[a-z0-9-]+$' });
```

```ts
text({ name: 'heading', translatable: true, default_value: 'Untitled' });
```
