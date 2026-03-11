# asset

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Single file or image picker. Lets editors select one asset from the Storyblok asset library. Use for hero images, thumbnails, downloadable files, etc.

```ts
import { asset } from "~/schema/field-type";
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
| `allow_external_url` | `boolean` | -- | Allow pasting an external URL instead of selecting from the library. |

---

## Examples

```ts
asset({ name: 'image' })

asset({
    name: 'hero_image',
    required: true,
    filetypes: ['images'],
})

asset({
    name: 'document',
    filetypes: ['texts'],
    allow_external_url: true,
    description: 'Upload a text file or link to an external document',
})
```

---

## See also

- [multiasset](./multiasset.md) -- for selecting multiple files
