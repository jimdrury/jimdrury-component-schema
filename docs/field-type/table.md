# table

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Editable table field. Renders a spreadsheet-like grid where editors can add rows and columns of data. Use for pricing tables, comparison charts, schedules, or any tabular content.

```ts
import { table } from "@jimdrury/storyblok-component-schema";
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

The table field has no additional parameters beyond the base set.

---

## Examples

```ts
table({ name: 'pricing' })

table({
    name: 'schedule',
    required: true,
    description: 'Event schedule with times and speakers',
})
```
