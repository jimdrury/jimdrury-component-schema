# option

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Single-select dropdown. Use when editors need to pick exactly one value from a predefined list. Supports inline options, datasources, internal stories, and external sources.

```ts
import { option } from "~/schema/field-type";
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
| `default_value` | `string` | -- | Pre-selected value for new entries. |
| `use_uuid` | `boolean` | -- | Store the option UUID instead of the value string. |
| `source` | `string` | -- | One of `internal`, `external`, `internal_stories`, `internal_languages`, or `""`. |
| `datasource_slug` | `string` | -- | Slug of a Storyblok datasource (when `source` is `internal`). |
| `external_datasource` | `string` | -- | URL of an external datasource (when `source` is `external`). |
| `filter_content_type` | `string[]` | -- | Filter stories by content type (when `source` is `internal_stories`). |
| `folder_slug` | `string` | -- | Restrict story source to a folder (when `source` is `internal_stories`). |

### OptionItem

Each item in the `options` array:

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Display label shown to editors. |
| `value` | `string` | Stored value. |

---

## Examples

### Inline options

```ts
option({
    name: 'color',
    options: [
        { name: 'Red', value: 'red' },
        { name: 'Green', value: 'green' },
        { name: 'Blue', value: 'blue' },
    ],
    default_value: 'red',
})
```

### With UUID storage

```ts
option({
    name: 'category',
    use_uuid: true,
    options: [
        { name: 'News', value: 'news' },
        { name: 'Blog', value: 'blog' },
    ],
})
```

---

## See also

- [options](./options.md) -- multi-select variant
