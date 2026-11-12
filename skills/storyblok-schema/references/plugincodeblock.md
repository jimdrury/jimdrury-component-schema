---
name: pluginCodeBlock
description: >-
  Use the pluginCodeBlock() factory for code block fields powered by the
  Storyblok Code Block plugin. Renders a syntax-highlighted code editor.
---

# pluginCodeBlock

Code block field with syntax highlighting, powered by the Storyblok Code Block plugin. Maps to a `custom` field type with `field_type: "storyblok-code-block"`.

## Import

```ts
import { pluginCodeBlock } from '@jimdrury/storyblok-component-schema';
```

## Parameters

### Base

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field key (internal name). |
| `description` | `string` | No | Help text in the editor. |
| `tooltip` | `boolean` | No | Show as tooltip. |
| `required` | `boolean` | No | Field is required. |

### Specific

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `languages` | `string[]` | No | Available language options (e.g. `"tsx"`, `"json"`, `"css"`). Defaults to `[]`. |
| `enable_title` | `boolean` | No | Show a title field above the code block. |
| `enable_line_number_start` | `boolean` | No | Allow editors to set a custom starting line number. |
| `highlight_states` | `{ value, color }[]` | No | At least 2 entries. Each has `value` (state name) and `color` (hex/CSS colour). Omit to disable. |

## Examples

```ts
pluginCodeBlock({ name: 'snippet' });
```

```ts
pluginCodeBlock({
  name: 'code',
  required: true,
  enable_title: true,
  languages: ['tsx', 'jsx', 'json', 'css', 'html'],
});
```

```ts
pluginCodeBlock({
  name: 'contents',
  required: true,
  enable_title: true,
  enable_line_number_start: true,
  languages: ['js', 'ts', 'json', 'md', 'html', 'css'],
  highlight_states: [
    { value: '', color: 'transparent' },
    { value: 'add', color: '#2db47d' },
    { value: 'remove', color: '#ff6159' },
  ],
});
```
