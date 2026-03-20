# textarea

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Multi-line plain text input. Use for descriptions, summaries, or any longer free-form text that doesn't need rich formatting.

```ts
import { textarea } from "@jimdrury/storyblok-component-schema";
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
| `default_value` | `string` | -- | Pre-filled value for new entries. |
| `max_length` | `number` | -- | Maximum character count. |

---

## Examples

```ts
textarea({ name: 'summary' })

textarea({
    name: 'bio',
    required: true,
    max_length: 500,
    description: 'Short author biography',
})

textarea({
    name: 'notes',
    default_value: 'Add notes here...',
})
```
