---
name: boolean
description: >-
  Use the boolean() factory for toggle/checkbox fields. Use when defining
  Storyblok schema fields.
---

# boolean

Toggle or checkbox for flags and on/off settings.

## Import

```ts
import { boolean } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `default_value` | no | `boolean` | Default on/off state. |
| `inline_label` | no | `boolean` | Show label inline with the control. |

## Examples

```ts
boolean({ name: 'is_featured' });
```

```ts
boolean({ name: 'show_header', default_value: true, inline_label: true });
```
