# multiasset

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Multiple file or image picker. Like [asset](./asset.md), but editors can select **multiple** files. Use for image galleries, file attachments, or any field that needs more than one asset.

```ts
import { multiasset } from "@jimdrury/storyblok-component-schema";
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
| `filetypes` | `AssetFiletype[]` | -- | Restrict to specific file types. Allowed values: `"images"`, `"videos"`, `"audios"`, `"texts"`. |
| `allow_external_url` | `boolean` | -- | Allow pasting external URLs instead of selecting from the library. |

---

## Examples

```ts
multiasset({ name: 'gallery' })

multiasset({
    name: 'photos',
    required: true,
    filetypes: ['images'],
})

multiasset({
    name: 'attachments',
    allow_external_url: true,
    description: 'Upload files or link to external resources',
})
```

---

## See also

- [asset](./asset.md) -- for selecting a single file
