---
name: multilink
description: >-
  Use the multilink() factory for link fields supporting internal stories,
  external URLs, email, and asset links.
---

# multilink

Link field supporting internal stories, external URLs, email, and asset links.

## Import

```ts
import { multilink } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Editors must set a link. |

### Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email_link_type` | `boolean` | No | Allow `mailto:` links. |
| `asset_link_type` | `boolean` | No | Allow linking to assets. |
| `show_anchor` | `boolean` | No | Allow anchor fragments. |
| `allow_target_blank` | `boolean` | No | Allow opening in a new tab. |
| `allow_custom_attributes` | `boolean` | No | Allow custom link attributes. |
| `force_link_scope` | `boolean` | No | Enforce link scope rules in the editor. |
| `allowed_content_types` | `ComponentRef[]` | No | Restrict internal links to these content types. |

A **ComponentRef** is any object with a `name` property (typically a `contentType` default export).

## Examples

```ts
multilink({ name: 'url' });
```

```ts
multilink({
  name: 'cta_link',
  email_link_type: true,
  allow_target_blank: true,
});
```
