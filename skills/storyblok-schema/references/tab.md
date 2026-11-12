---
name: tab
description: >-
  Use the tab() factory to group fields into editor tabs. UI-only -- does not
  affect content structure.
---

# tab

Groups fields under a named tab in the Storyblok editor. Does not change the stored content shape.

## Import

```ts
import { tab } from '@jimdrury/storyblok-component-schema';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Tab identifier; auto-prefixed with `tab_` for the API. |
| `display_name` | `string` | Yes | Label shown in the editor. |
| `fields` | `FieldType[]` | Yes | Field factories inside this tab. |

### Behaviour

- Fields **before** the first `tab()` appear in the default **General** tab.
- Field `name` values must be **unique across the whole schema**, not only within a tab.

## Examples

```ts
tab({
  name: 'seo',
  display_name: 'SEO',
  fields: [
    text({ name: 'meta_title' }),
    textarea({ name: 'meta_description', max_length: 160 }),
  ],
});
```

(Requires `text` and `textarea` imported from the same package.)
