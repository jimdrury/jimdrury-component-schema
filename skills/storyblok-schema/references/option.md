---
name: option
description: >-
  Use the option() factory for single-select dropdown fields. Supports inline
  options, datasources, and internal stories.
---

# option

Single-select dropdown field for Storyblok component schemas.

## Import

```ts
import { option } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Editors must set a value. |

### Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `OptionItem[]` (`{ name, value }`) | Yes | Choices shown in the dropdown. |
| `default_value` | `string` | No | Pre-selected value. |
| `use_uuid` | `boolean` | No | Store UUID instead of value where applicable. |
| `source` | `string` | No | Data source configuration. |
| `datasource_slug` | `string` | No | Storyblok datasource slug. |
| `external_datasource` | `string` | No | External datasource identifier. |
| `filter_content_type` | `string[]` | No | Limit internal story options by content type. |
| `folder_slug` | `string` | No | Limit options to a folder. |

## Examples

```ts
option({
  name: 'color',
  options: [
    { name: 'Red', value: 'red' },
    { name: 'Blue', value: 'blue' },
  ],
  default_value: 'red',
});
```
