---
name: table
description: >-
  Use the table() factory for editable spreadsheet-like table fields.
---

# table

Spreadsheet-style editable table field in the Storyblok editor.

## Import

```ts
import { table } from '@jimdrury/storyblok-component-schema';
```

## Parameters

Only the shared base field parameters apply:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Editors must fill the table. |

## Examples

```ts
table({ name: 'pricing' });
```

```ts
table({ name: 'schedule', required: true });
```
