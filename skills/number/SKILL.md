---
name: number
description: >-
  Use the number() factory for numeric input fields like prices, ratings, or
  quantities. Use when defining Storyblok schema fields.
---

# number

Numeric values with optional min/max, decimals, step, and default.

## Import

```ts
import { number } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `min_value` | no | `number` | Minimum allowed value. |
| `max_value` | no | `number` | Maximum allowed value. |
| `decimals` | no | `number` | Number of decimal places. |
| `steps` | no | `number` | Step increment for the input. |
| `default_value` | no | `number` | Default numeric value. |

## Examples

```ts
number({ name: 'sort_order' });
```

```ts
number({ name: 'price', min_value: 0, decimals: 2, steps: 0.01 });
```

```ts
number({ name: 'rating', min_value: 1, max_value: 5, default_value: 3 });
```
