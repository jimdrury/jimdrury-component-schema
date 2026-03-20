---
name: datetime
description: >-
  Use the datetime() factory for date and time picker fields. Use when
  defining Storyblok schema fields.
---

# datetime

Date and optional time selection (ISO 8601 values in the API).

## Import

```ts
import { datetime } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `disable_time` | no | `boolean` | Date-only picker (no time). |
| `default_value` | no | `string` | Default as ISO 8601 string. |

## Examples

```ts
datetime({ name: 'created_at' });
```

```ts
datetime({ name: 'published_at', disable_time: true });
```
