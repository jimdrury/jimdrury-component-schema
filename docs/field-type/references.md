# references

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Story reference field. Lets editors pick one or more published stories from the space. Under the hood this maps to the Storyblok `options` type with `source: "internal_stories"` -- the factory sets those flags automatically so you only configure what matters.

```ts
import { references } from "~/schema/field-type";
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
| `filter_content_type` | `ComponentRef[]` | -- | Only show stories of these content types. |
| `folder_slug` | `string` | -- | Restrict the story picker to a folder path (e.g. `"/home"`). |
| `entry_appearance` | `"card"` \| `"link"` | -- | How referenced stories are displayed in the editor. |
| `allow_advanced_search` | `boolean` | -- | Enable the advanced search panel in the story picker. |

A `ComponentRef` is any object with a `name` property -- typically another component's default export.

---

## Examples

### Minimal

```ts
references({ name: 'related' })
```

### Filter by content type

```ts
import blog from "./blog";

references({
    name: 'related_posts',
    filter_content_type: [blog],
    entry_appearance: 'card',
})
```

### Restrict to a folder with advanced search

```ts
import blog from "./blog";

references({
    name: 'featured',
    filter_content_type: [blog],
    folder_slug: '/home',
    entry_appearance: 'link',
    allow_advanced_search: true,
})
```

---

## See also

- [options](./options.md) -- general multi-select (static options, datasources, etc.)
