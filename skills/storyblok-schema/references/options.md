---
name: options
description: >-
  Use the options() factory for multi-select dropdown fields. Like option()
  but allows multiple selections.
---

# options

Multi-select dropdown field for Storyblok component schemas.

## Import

```ts
import { options } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Editors must set at least one value (per other rules). |

### Specific (same as `option`, plus multi-select)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `OptionItem[]` (`{ name, value }`) | Yes | Choices shown in the dropdown. |
| `default_value` | `string[]` | No | Pre-selected values. |
| `min_options` | `number` | No | Minimum number of selections. |
| `max_options` | `number` | No | Maximum number of selections. |
| `use_uuid` | `boolean` | No | Store UUIDs instead of values where applicable. |
| `source` | `string` | No | Data source configuration. |
| `datasource_slug` | `string` | No | Storyblok datasource slug. |
| `external_datasource` | `string` | No | External datasource identifier. |
| `filter_content_type` | `string[]` | No | Limit internal story options by content type. |
| `folder_slug` | `string` | No | Limit options to a folder. |

## Examples

```ts
options({
  name: 'categories',
  min_options: 1,
  max_options: 3,
  options: [
    { name: 'Tech', value: 'tech' },
    { name: 'Design', value: 'design' },
  ],
});
```
