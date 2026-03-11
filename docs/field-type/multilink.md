# multilink

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Link field supporting internal stories, external URLs, email addresses, and asset links. Use for CTAs, navigation items, or any field that needs to point somewhere.

```ts
import { multilink } from "~/schema/field-type";
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
| `email_link_type` | `boolean` | -- | Allow `mailto:` links. |
| `asset_link_type` | `boolean` | -- | Allow linking to assets (files, images). |
| `show_anchor` | `boolean` | -- | Show an anchor/hash field for deep linking. |
| `allow_target_blank` | `boolean` | -- | Allow links to open in a new tab. |
| `allow_custom_attributes` | `boolean` | -- | Allow editors to set custom HTML attributes on the link. |
| `force_link_scope` | `boolean` | -- | Force links to stay within the current folder scope. |
| `allowed_content_types` | `ComponentRef[]` | -- | Restrict internal links to specific content types. |

A `ComponentRef` is any object with a `name` property -- typically another component's default export.

---

## Examples

### Basic

```ts
multilink({ name: 'url' })
```

### Full-featured

```ts
multilink({
    name: 'cta_link',
    required: true,
    email_link_type: true,
    asset_link_type: true,
    show_anchor: true,
    allow_target_blank: true,
})
```

### Restricted to specific content types

```ts
import blog from "./blog";
import page from "./page";

multilink({
    name: 'related_link',
    allowed_content_types: [blog, page],
})
```
