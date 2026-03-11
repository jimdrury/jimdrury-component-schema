# options

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Multi-select dropdown. Like [option](./option.md), but editors can pick **multiple** values. Supports the same data sources.

```ts
import { options } from "~/schema/field-type";
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
| `options` | `OptionItem[]` | yes | Array of `{ name, value }` pairs. |
| `default_value` | `string[]` | -- | Pre-selected values for new entries. |
| `min_options` | `number` | -- | Minimum number of selections required. |
| `max_options` | `number` | -- | Maximum number of selections allowed. |
| `use_uuid` | `boolean` | -- | Store option UUIDs instead of value strings. |
| `source` | `string` | -- | One of `internal`, `external`, `internal_stories`, `internal_languages`, or `""`. |
| `datasource_slug` | `string` | -- | Slug of a Storyblok datasource (when `source` is `internal`). |
| `external_datasource` | `string` | -- | URL of an external datasource (when `source` is `external`). |
| `filter_content_type` | `string[]` | -- | Filter stories by content type (when `source` is `internal_stories`). |
| `folder_slug` | `string` | -- | Restrict story source to a folder (when `source` is `internal_stories`). |

---

## Examples

```ts
options({
    name: 'tags',
    options: [
        { name: 'Featured', value: 'featured' },
        { name: 'New', value: 'new' },
        { name: 'Popular', value: 'popular' },
    ],
})

options({
    name: 'categories',
    min_options: 1,
    max_options: 3,
    default_value: ['general'],
    options: [
        { name: 'General', value: 'general' },
        { name: 'Tech', value: 'tech' },
        { name: 'Design', value: 'design' },
        { name: 'Business', value: 'business' },
    ],
})
```

---

## See also

- [option](./option.md) -- single-select variant
