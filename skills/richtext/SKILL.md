---
name: richtext
description: >-
  Use the richtext() factory for WYSIWYG rich text editor fields. Use when
  defining Storyblok schema fields.
---

# richtext

WYSIWYG rich text content with formatting, links, and embeds as supported by Storyblok.

## Import

```ts
import { richtext } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `max_length` | no | `number` | Maximum character length. |
| `allow_target_blank` | no | `boolean` | Allow links to open in a new tab (`target="_blank"`). |

## Examples

```ts
richtext({ name: 'content' });
```

```ts
richtext({ name: 'body', required: true, allow_target_blank: true });
```
