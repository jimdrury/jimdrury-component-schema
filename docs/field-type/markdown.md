# markdown

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Markdown editor. Stores raw markdown text. Use when you want editors to write in markdown syntax, or when you need markdown output for rendering.

```ts
import { markdown } from "@jimdrury/storyblok-component-schema";
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
| `max_length` | `number` | -- | Maximum character count. |
| `rich_markdown` | `boolean` | -- | Enable the rich markdown editor with a visual toolbar. |

---

## Examples

```ts
markdown({ name: 'content' })

markdown({
    name: 'readme',
    rich_markdown: true,
    max_length: 50000,
})
```
