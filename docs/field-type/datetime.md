# datetime

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Date and time picker. Use for publish dates, event times, deadlines, or any temporal value.

```ts
import { datetime } from "~/schema/field-type";
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
| `disable_time` | `boolean` | -- | Hide the time picker, showing only the date. |
| `default_value` | `string` | -- | Pre-filled value for new entries (ISO 8601 format). |

---

## Examples

```ts
datetime({ name: 'created_at' })

datetime({
    name: 'published_at',
    required: true,
    disable_time: true,
})

datetime({
    name: 'event_start',
    description: 'When the event begins',
    default_value: '2025-01-01T00:00:00.000Z',
})
```
