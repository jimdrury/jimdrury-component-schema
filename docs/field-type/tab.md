# tab

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Group fields into a tab in the Storyblok editor. Tabs are a UI-only concept — they don't affect content structure, but they help editors navigate components with many fields.

Fields before the first `tab()` appear in Storyblok's default "General" tab. Each `tab()` creates an additional tab containing the fields passed to it.

```ts
import { tab } from "@jimdrury/storyblok-component-schema";
```

---

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | yes | Tab key. Lowercase letters and underscores only. Prefixed with `tab_` in the Storyblok schema. |
| `display_name` | `string` | yes | Label shown on the tab in the editor. |
| `fields` | `FieldType[]` | yes | One or more fields to group under this tab. |

---

## How it works

A `tab()` entry wraps its fields. When the schema is built, the wrapped fields are flattened into the component's top-level schema and a tab entry is created with a `keys` array pointing to them.

Given this definition:

```ts
schema: [
    text({ name: 'title' }),
    tab({
        name: 'seo',
        display_name: 'SEO',
        fields: [
            text({ name: 'meta_title' }),
            text({ name: 'meta_description' }),
        ],
    }),
]
```

The resulting Storyblok schema is:

```json
{
  "title": { "type": "text" },
  "meta_title": { "type": "text" },
  "meta_description": { "type": "text" },
  "tab_seo": {
    "type": "tab",
    "display_name": "SEO",
    "keys": ["meta_title", "meta_description"]
  }
}
```

Field names inside tabs are validated for uniqueness against all other fields in the component — the compiler will catch duplicates even across tabs.

---

## Examples

### Single tab

```ts
schema: [
    blocks({ name: 'body' }),
    tab({
        name: 'config',
        display_name: 'Config',
        fields: [
            text({ name: 'title' }),
        ],
    }),
]
```

### Multiple tabs

```ts
schema: [
    blocks({ name: 'body' }),
    tab({
        name: 'seo',
        display_name: 'SEO',
        fields: [
            text({ name: 'meta_title', required: true }),
            textarea({ name: 'meta_description', max_length: 160 }),
        ],
    }),
    tab({
        name: 'settings',
        display_name: 'Settings',
        fields: [
            boolean({ name: 'hide_navigation' }),
            option({ name: 'theme', source: 'self', options: [
                { name: 'Light', value: 'light' },
                { name: 'Dark', value: 'dark' },
            ]}),
        ],
    }),
]
```
