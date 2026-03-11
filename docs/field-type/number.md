# number

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Numeric input field. Use for quantities, prices, ratings, sort orders, or any numeric value.

```ts
import { number } from "~/schema/field-type";
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
| `min_value` | `number` | -- | Minimum allowed value. |
| `max_value` | `number` | -- | Maximum allowed value. |
| `decimals` | `number` | -- | Number of decimal places. |
| `steps` | `number` | -- | Step increment for the input control. |
| `default_value` | `number` | -- | Pre-filled value for new entries. |

---

## Examples

```ts
number({ name: 'sort_order' })

number({
    name: 'price',
    required: true,
    min_value: 0,
    decimals: 2,
    steps: 0.01,
})

number({
    name: 'rating',
    min_value: 1,
    max_value: 5,
    steps: 1,
    default_value: 3,
})
```
