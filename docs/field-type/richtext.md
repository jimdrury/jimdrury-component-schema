# richtext

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Visual rich text editor (WYSIWYG). Produces structured content that can include headings, lists, bold, italic, links, and more. Use for body content where editors need formatting controls.

```ts
import { richtext } from "~/schema/field-type";
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
| `allow_target_blank` | `boolean` | -- | Allow links to open in a new tab. |

---

## Examples

```ts
richtext({ name: 'content' })

richtext({
    name: 'body',
    required: true,
    max_length: 10000,
    allow_target_blank: true,
})
```
