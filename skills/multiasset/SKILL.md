---
name: multiasset
description: >-
  Use the multiasset() factory for multiple file/image picker fields like
  galleries. Use when defining Storyblok schema fields.
---

# multiasset

Multiple assets (gallery, file lists). Same options as `asset()` for filtering and external URLs.

## Import

```ts
import { multiasset } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `name` | yes | `string` | Field key in the schema. |
| `description` | no | `string` | Help text shown in the editor. |
| `tooltip` | no | `string` | Tooltip for the field. |
| `required` | no | `boolean` | Whether the field is required. |
| `filetypes` | no | `AssetFiletype[]` | Allowed kinds: `"images"`, `"videos"`, `"audios"`, `"texts"`. |
| `allow_external_url` | no | `boolean` | Allow picking/linking an external URL. |

## Examples

```ts
multiasset({ name: 'gallery' });
```

```ts
multiasset({ name: 'photos', required: true, filetypes: ['images'] });
```
