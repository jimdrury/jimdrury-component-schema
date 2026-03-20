# text

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Single-line text input. Use for titles, headings, slugs, or any short string value.

```ts
import { text } from "@jimdrury/storyblok-component-schema";
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
| `translatable` | `boolean` | -- | Enable per-locale translation for this field. |
| `default_value` | `string` | -- | Pre-filled value for new entries. |
| `max_length` | `number` | -- | Maximum character count. |
| `regex` | `string` | -- | Validation regex pattern. |

---

## Examples

```ts
text({ name: 'title', required: true })

text({
    name: 'slug',
    max_length: 80,
    regex: '^[a-z0-9-]+$',
    description: 'URL-safe identifier',
})

text({
    name: 'heading',
    translatable: true,
    default_value: 'Untitled',
    tooltip: true,
})
```
