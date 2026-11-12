---
name: references
description: >-
  Use the references() factory for story reference picker fields. Lets editors
  pick published stories from the space.
---

# references

Story reference picker: choose one or more published stories from the space.

## Import

```ts
import { references } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Editors must pick at least one story (if applicable). |

### Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter_content_type` | `ComponentRef[]` | No | Limit picker to these content types. |
| `folder_slug` | `string` | No | Limit stories to a folder. |
| `entry_appearance` | `"card"` \| `"link"` | No | How entries appear in the picker. |
| `allow_advanced_search` | `boolean` | No | Enable advanced search in the UI. |

A **ComponentRef** is any object with a `name` property (typically a `contentType` default export).

## Examples

```ts
references({ name: 'related' });
```

```ts
import blog from './blog';

references({
  name: 'related_posts',
  filter_content_type: [blog],
  entry_appearance: 'card',
});
```
