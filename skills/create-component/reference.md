# Field Type Reference

Complete parameter reference for every field type factory. All factories are imported from `@jimdrury/storyblok-component-schema`.

## Base Parameters (all fields)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Field key. `/^[a-z_]+$/` only. |
| `description` | `string` | no | Help text shown to editors. |
| `tooltip` | `boolean` | no | Show description as tooltip instead of inline. |
| `required` | `boolean` | no | Mark field as required. |

---

## text

Single-line text input.

| Parameter | Type | Description |
|-----------|------|-------------|
| `translatable` | `boolean` | Enable per-locale translation. |
| `default_value` | `string` | Pre-filled value for new entries. |
| `max_length` | `number` | Maximum character count. |
| `regex` | `string` | Validation regex pattern. |

```ts
text({ name: 'slug', max_length: 80, regex: '^[a-z0-9-]+$' })
```

---

## textarea

Multi-line plain text.

| Parameter | Type | Description |
|-----------|------|-------------|
| `default_value` | `string` | Pre-filled value. |
| `max_length` | `number` | Maximum character count. |

```ts
textarea({ name: 'bio', max_length: 500, required: true })
```

---

## richtext

WYSIWYG rich text editor.

| Parameter | Type | Description |
|-----------|------|-------------|
| `max_length` | `number` | Maximum character count. |
| `allow_target_blank` | `boolean` | Allow links to open in new tab. |

```ts
richtext({ name: 'body', allow_target_blank: true })
```

---

## markdown

Markdown editor.

| Parameter | Type | Description |
|-----------|------|-------------|
| `max_length` | `number` | Maximum character count. |
| `rich_markdown` | `boolean` | Enable visual toolbar. |

```ts
markdown({ name: 'readme', rich_markdown: true })
```

---

## number

Numeric input.

| Parameter | Type | Description |
|-----------|------|-------------|
| `min_value` | `number` | Minimum allowed value. |
| `max_value` | `number` | Maximum allowed value. |
| `decimals` | `number` | Decimal places. |
| `steps` | `number` | Step increment. |
| `default_value` | `number` | Pre-filled value. |

```ts
number({ name: 'price', min_value: 0, decimals: 2, steps: 0.01 })
```

---

## datetime

Date and time picker.

| Parameter | Type | Description |
|-----------|------|-------------|
| `disable_time` | `boolean` | Show date only, hide time picker. |
| `default_value` | `string` | Pre-filled value (ISO 8601). |

```ts
datetime({ name: 'published_at', disable_time: true })
```

---

## boolean

Toggle / checkbox.

| Parameter | Type | Description |
|-----------|------|-------------|
| `default_value` | `boolean` | Pre-filled value. |
| `inline_label` | `boolean` | Show label inline next to toggle. |

```ts
boolean({ name: 'show_header', default_value: true, inline_label: true })
```

---

## option

Single-select dropdown.

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `{ name, value }[]` | **Required.** Selection items. |
| `default_value` | `string` | Pre-selected value. |
| `use_uuid` | `boolean` | Store option UUID instead of value string. |
| `source` | `string` | `"internal"`, `"external"`, `"internal_stories"`, `"internal_languages"`, or `""`. |
| `datasource_slug` | `string` | Datasource slug (when `source` is `"internal"`). |
| `external_datasource` | `string` | External URL (when `source` is `"external"`). |
| `filter_content_type` | `string[]` | Filter stories by type (when `source` is `"internal_stories"`). |
| `folder_slug` | `string` | Restrict to folder (when `source` is `"internal_stories"`). |

```ts
option({
    name: 'color',
    options: [
        { name: 'Red', value: 'red' },
        { name: 'Blue', value: 'blue' },
    ],
    default_value: 'red',
})
```

---

## options

Multi-select dropdown. Same params as `option`, plus:

| Parameter | Type | Description |
|-----------|------|-------------|
| `default_value` | `string[]` | Pre-selected values (array). |
| `min_options` | `number` | Minimum selections required. |
| `max_options` | `number` | Maximum selections allowed. |

```ts
options({
    name: 'categories',
    min_options: 1,
    max_options: 3,
    options: [
        { name: 'Tech', value: 'tech' },
        { name: 'Design', value: 'design' },
    ],
})
```

---

## blocks

Nested component blocks.

| Parameter | Type | Description |
|-----------|------|-------------|
| `minimum` | `number` | Minimum blocks required. |
| `maximum` | `number` | Maximum blocks allowed. |

**Restriction params** (mutually exclusive -- use only one type):

| Parameter | Type | Description |
|-----------|------|-------------|
| `allowed_components` | `ComponentRef[]` | Only these components allowed. |
| `allowed_folders` | `string[]` | Only components in these folders. |
| `allowed_tags` | `string[]` | Only components with these tags. |
| `disallowed_components` | `ComponentRef[]` | These components excluded. |
| `disallowed_folders` | `string[]` | Components in these folders excluded. |
| `disallowed_tags` | `string[]` | Components with these tags excluded. |

A `ComponentRef` is any object with a `name` property (typically a component's default export).

```ts
import hero from './hero';
blocks({ name: 'sections', allowed_components: [hero], maximum: 5 })
```

---

## multilink

Link field (internal, external, email, asset).

| Parameter | Type | Description |
|-----------|------|-------------|
| `email_link_type` | `boolean` | Allow `mailto:` links. |
| `asset_link_type` | `boolean` | Allow asset links. |
| `show_anchor` | `boolean` | Show anchor/hash field. |
| `allow_target_blank` | `boolean` | Allow opening in new tab. |
| `allow_custom_attributes` | `boolean` | Allow custom HTML attributes. |
| `force_link_scope` | `boolean` | Force links within folder scope. |
| `allowed_content_types` | `ComponentRef[]` | Restrict internal links to these types. |

```ts
multilink({ name: 'cta', email_link_type: true, allow_target_blank: true })
```

---

## asset

Single file/image picker.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filetypes` | `AssetFiletype[]` | Restrict to: `"images"`, `"videos"`, `"audios"`, `"texts"`. |
| `allow_external_url` | `boolean` | Allow pasting external URL. |

```ts
asset({ name: 'hero_image', filetypes: ['images'], required: true })
```

---

## multiasset

Multiple file/image picker. Same params as `asset`.

```ts
multiasset({ name: 'gallery', filetypes: ['images'] })
```

---

## tab

Group fields into an editor tab. Not a data field -- UI organization only.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Tab key (auto-prefixed with `tab_`). |
| `display_name` | `string` | yes | Tab label in editor. |
| `fields` | `FieldType[]` | yes | Fields grouped under this tab. |

Fields before the first `tab()` appear in the default "General" tab.

```ts
tab({
    name: 'seo',
    display_name: 'SEO',
    fields: [
        text({ name: 'meta_title' }),
        textarea({ name: 'meta_description', max_length: 160 }),
    ],
})
```

---

## table

Editable spreadsheet-like table. No specific params beyond base.

```ts
table({ name: 'pricing', required: true })
```

---

## references

Story reference picker. Maps to Storyblok `options` with `source: "internal_stories"` under the hood.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter_content_type` | `ComponentRef[]` | Only show stories of these types. |
| `folder_slug` | `string` | Restrict picker to a folder path. |
| `entry_appearance` | `"card"` \| `"link"` | How references display in editor. |
| `allow_advanced_search` | `boolean` | Enable advanced search panel. |

```ts
import blog from './blog';
references({ name: 'related', filter_content_type: [blog], entry_appearance: 'card' })
```
