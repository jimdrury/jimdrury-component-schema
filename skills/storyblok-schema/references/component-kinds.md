---
name: component-kinds
description: >-
  Explains the three Storyblok component kinds (page, blok, universal), how
  each maps to is_root and is_nestable, and which
  @jimdrury/storyblok-component-schema builder authors each. Use before
  creating a component or changing a component's kind.
---

# Component kinds

Every new component is a page component, a blok component, or a universal
component. Ask the user which one before writing the file; do not infer it
from the name or fields. If the request already names the kind explicitly,
use it.

| Kind      | Storyblok UI name | Builder         | `is_root` | `is_nestable` | Can create a story | Can go in a `blocks()` field |
| --------- | ----------------- | --------------- | --------- | ------------- | ------------------ | ---------------------------- |
| Page      | Content type      | `contentType()` | `true`    | `false`       | yes                | no                           |
| Blok      | Nestable          | `nestable()`    | `false`   | `true`        | no                 | yes                          |
| Universal | Universal         | `universal()`   | `true`    | `true`        | yes                | yes                          |

Suggested wording for the question:

- **Page component**: a story type editors create directly, such as a page,
  article, or settings entry. It cannot be placed inside another component.
- **Blok component**: a reusable section placed inside another component's
  `blocks()` field, such as a hero or card. Editors cannot create a story from it.
- **Universal component**: works as both. Editors can create a story from it
  and place it inside `blocks()` fields.

Each builder sets both `is_root` and `is_nestable` explicitly, so `plan`
detects and corrects a component whose kind was changed in the Storyblok UI.

## Page component

```ts
import {
  blocks,
  contentType,
  text,
} from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "landing_page",
  display_name: "Landing page",
  preview_field: "title",
  schema: [
    text({ name: "title", required: true }),
    blocks({ name: "body" }),
  ],
});
```

## Blok component

```ts
import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "promo_banner",
  display_name: "Promo banner",
  schema: [text({ name: "title" })],
});
```

## Universal component

```ts
import {
  richtext,
  text,
  universal,
} from "@jimdrury/storyblok-component-schema";

export default universal({
  name: "faq",
  display_name: "FAQ",
  preview_field: "question",
  schema: [
    text({ name: "question", required: true }),
    richtext({ name: "answer" }),
  ],
});
```

## Rendering

The kind decides where the renderer receives the component:

- **Page**: only as the story root, so it can own page-level structure such
  as the main heading.
- **Blok**: only inside a parent's `blocks()` field.
- **Universal**: in both positions, so its renderer must not assume it is the
  page root (for example, do not hard-code the page's only `h1`).

## Changing kind

Changing an existing component's kind means switching its builder, which
`plan` reports as an update to `is_root` or `is_nestable`. Before making a
component non-nestable, check that no `blocks()` field allows it and no story
content embeds it. Before making it non-root, check that no stories use it as
their content type.
