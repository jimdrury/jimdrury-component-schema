---
name: asset
description: >-
  Use the asset() factory for single file/image picker fields. Use when
  defining Storyblok schema fields.
---

# asset

Single asset (image, video, audio, or text file) from the Storyblok DAM or external URL.

## Import

```ts
import { asset } from '@jimdrury/storyblok-component-schema';
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
asset({ name: 'image' });
```

```ts
asset({ name: 'hero_image', required: true, filetypes: ['images'] });
```
