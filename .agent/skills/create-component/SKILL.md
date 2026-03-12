---
name: create-component
description: >-
  Create and configure Storyblok component definitions using the TypeScript
  schema DSL. Use when the user wants to add a new component, define fields,
  set up content types or nestable blocks, or work with files in the
  components/ directory.
---

# Create Component

Define Storyblok components as TypeScript files in `components/`. Each file default-exports a call to `contentType()` or `nestable()` with a `schema` array of field types.

## Workflow

1. Create `components/<name>.ts`
2. Import the component-type factory and field-type factories
3. Default-export the component definition
4. Run `yarn plan` to preview, `yarn apply` to push

## Imports

```ts
import { contentType } from '~/schema/component-type';
import { nestable } from '~/schema/component-type';
import { text, textarea, richtext, markdown, number, datetime, boolean, option, options, blocks, multilink, asset, multiasset, tab, table, references } from '~/schema/field-type';
```

Only import the factories you need. `~` resolves to `src/`.

## Component Types

### contentType -- root-level entries (pages, articles, settings)

```ts
export default contentType({
    name: 'page',              // required -- lowercase + underscores only
    display_name: 'Page',      // required -- label in Storyblok UI
    folder: 'content',         // optional -- component group path
    tags: ['marketing'],       // optional -- for filtering / block restrictions
    image: 'https://...',      // optional -- preview image URL
    preview_field: 'title',    // optional -- field used as preview title
    schema: [ /* fields */ ],  // required -- array of field definitions
});
```

Returns `is_root: true`.

### nestable -- reusable blocks embedded via `blocks()` fields

```ts
export default nestable({
    name: 'hero',
    display_name: 'Hero',
    folder: 'layout',
    tags: ['layout'],
    schema: [ /* fields */ ],
});
```

Returns `is_root: false, is_nestable: true`. Parameters are identical to `contentType`.

## Field Types Quick Reference

Every field accepts base params: `name` (required), `description`, `tooltip`, `required`.

| Factory | Use for | Key specific params |
|---------|---------|---------------------|
| `text` | Short strings | `translatable`, `default_value`, `max_length`, `regex` |
| `textarea` | Multi-line text | `default_value`, `max_length` |
| `richtext` | WYSIWYG editor | `max_length`, `allow_target_blank` |
| `markdown` | Markdown editor | `max_length`, `rich_markdown` |
| `number` | Numeric input | `min_value`, `max_value`, `decimals`, `steps`, `default_value` |
| `datetime` | Date/time picker | `disable_time`, `default_value` |
| `boolean` | Toggle | `default_value`, `inline_label` |
| `option` | Single-select | `options` (required), `default_value`, `source`, `datasource_slug` |
| `options` | Multi-select | `options` (required), `default_value`, `min_options`, `max_options` |
| `blocks` | Nested blocks | `minimum`, `maximum`, restriction params (see below) |
| `multilink` | Links | `email_link_type`, `asset_link_type`, `show_anchor`, `allow_target_blank` |
| `asset` | Single file | `filetypes`, `allow_external_url` |
| `multiasset` | Multiple files | `filetypes`, `allow_external_url` |
| `tab` | Editor tabs | `display_name` (required), `fields` (required) |
| `table` | Editable table | (base params only) |
| `references` | Story picker | `filter_content_type`, `folder_slug`, `entry_appearance` |

For full parameter details on every field type, see [reference.md](reference.md).

## Block Restrictions

`blocks()` supports one restriction type at a time (mutually exclusive):

```ts
// By specific components
import hero from './hero';
blocks({ name: 'sections', allowed_components: [hero] })

// By folder
blocks({ name: 'widgets', allowed_folders: ['ui'] })

// By tag
blocks({ name: 'body', disallowed_tags: ['layout'] })
```

Available restriction params: `allowed_components`, `allowed_folders`, `allowed_tags`, `disallowed_components`, `disallowed_folders`, `disallowed_tags`.

## Tabs

Fields before the first `tab()` go into Storyblok's default "General" tab. Each `tab()` groups its fields under a named tab.

```ts
schema: [
    text({ name: 'title' }),
    tab({
        name: 'seo',
        display_name: 'SEO',
        fields: [
            text({ name: 'meta_title' }),
            textarea({ name: 'meta_description', max_length: 160 }),
        ],
    }),
]
```

Tab `name` is auto-prefixed with `tab_` in the API payload. Field names must be unique across all tabs.

## Validation Rules

- **Field names**: lowercase letters and underscores only (`/^[a-z_]+$/`)
- **Unique names**: duplicate field names cause a compile-time type error
- **Zod validation**: all params are validated at runtime via Zod schemas
- **Block restrictions**: only one restriction type per `blocks()` field

## Complete Examples

### Content type with tabs

```ts
import { contentType } from '~/schema/component-type';
import { blocks, boolean, datetime, option, tab, text, textarea } from '~/schema/field-type';

export default contentType({
    name: 'article',
    display_name: 'Article',
    folder: 'content',
    preview_field: 'title',
    schema: [
        text({ name: 'title', required: true }),
        blocks({ name: 'body' }),
        tab({
            name: 'metadata',
            display_name: 'Metadata',
            fields: [
                datetime({ name: 'published_at', disable_time: true }),
                option({
                    name: 'status',
                    options: [
                        { name: 'Draft', value: 'draft' },
                        { name: 'Published', value: 'published' },
                    ],
                    default_value: 'draft',
                }),
            ],
        }),
        tab({
            name: 'seo',
            display_name: 'SEO',
            fields: [
                text({ name: 'meta_title' }),
                textarea({ name: 'meta_description', max_length: 160 }),
                boolean({ name: 'noindex', default_value: false }),
            ],
        }),
    ],
});
```

### Nestable with restrictions and tags

```ts
import { nestable } from '~/schema/component-type';
import { asset, blocks, multilink, option, text } from '~/schema/field-type';

export default nestable({
    name: 'card',
    display_name: 'Card',
    folder: 'ui',
    tags: ['content'],
    preview_field: 'title',
    schema: [
        text({ name: 'title', required: true }),
        asset({ name: 'image', filetypes: ['images'] }),
        multilink({
            name: 'link',
            allow_target_blank: true,
        }),
        option({
            name: 'variant',
            options: [
                { name: 'Default', value: 'default' },
                { name: 'Featured', value: 'featured' },
            ],
            default_value: 'default',
        }),
    ],
});
```

### Story references

```ts
import { contentType } from '~/schema/component-type';
import { references, text } from '~/schema/field-type';
import blog from './blog';

export default contentType({
    name: 'blog_listing',
    display_name: 'Blog Listing',
    schema: [
        text({ name: 'title', required: true }),
        references({
            name: 'featured_posts',
            filter_content_type: [blog],
            entry_appearance: 'card',
        }),
    ],
});
```

## Checklist

When creating a component:

- [ ] File is `components/<name>.ts` with a default export
- [ ] `name` uses lowercase letters and underscores only
- [ ] `display_name` is set to a human-readable label
- [ ] All field `name` values are unique across the entire schema (including inside tabs)
- [ ] `blocks()` fields use at most one restriction type
- [ ] Run `yarn plan` to verify before `yarn apply`
