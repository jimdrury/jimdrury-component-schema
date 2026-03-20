# boolean

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Toggle or checkbox field. Use for on/off states like visibility flags, feature toggles, or any true/false value.

```ts
import { boolean } from "@jimdrury/storyblok-component-schema";
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
| `default_value` | `boolean` | -- | Pre-filled value for new entries. |
| `inline_label` | `boolean` | -- | Show the field label inline next to the toggle. |

---

## Examples

```ts
boolean({ name: 'is_featured' })

boolean({
    name: 'show_header',
    default_value: true,
    inline_label: true,
})

boolean({
    name: 'is_published',
    tooltip: true,
    description: 'Controls whether this entry is visible on the site',
})
```
