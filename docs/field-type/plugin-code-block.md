# pluginCodeBlock

[< Back to overview](../readme.md) · [All field types](../readme.md#field-types)

---

Code block field powered by the Storyblok Code Block plugin. Renders a syntax-highlighted code editor in the Storyblok visual editor. Use for code snippets, embeddable examples, or any structured code content.

Under the hood this maps to a `custom` field with `field_type: "storyblok-code-block"`. The factory converts friendly boolean/array params into the plugin's `options` array format automatically.

```ts
import { pluginCodeBlock } from "@jimdrury/storyblok-component-schema";
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
| `languages` | `string[]` | `[]` | Language options available in the code block (e.g. `"tsx"`, `"json"`, `"css"`). |
| `enable_title` | `boolean` | `false` | Show a title field above the code block. |
| `enable_line_number_start` | `boolean` | `false` | Let editors set a custom starting line number. |
| `highlight_states` | `HighlightState[]` | -- | At least 2 entries. Each has `value` (state name) and `color` (hex or CSS colour). Omit to disable highlighting. |

### HighlightState

Each item in the `highlight_states` array:

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | State identifier stored in content. Use `""` for the default (unhighlighted) state. |
| `color` | `string` | Highlight colour shown in the visual editor (hex code or CSS colour name). |

---

## Examples

### Minimal

```ts
pluginCodeBlock({ name: 'snippet' })
```

### With languages and title

```ts
pluginCodeBlock({
    name: 'code',
    required: true,
    enable_title: true,
    languages: ['tsx', 'jsx', 'json', 'css', 'html'],
})
```

### Full options

```ts
pluginCodeBlock({
    name: 'contents',
    required: true,
    enable_title: true,
    enable_line_number_start: true,
    languages: ['js', 'ts', 'json', 'md', 'html', 'css'],
    highlight_states: [
        { value: '', color: 'transparent' },
        { value: 'attention', color: '#fbce41' },
        { value: 'add', color: '#2db47d' },
        { value: 'remove', color: '#ff6159' },
    ],
    description: 'Code snippet with syntax highlighting',
})
```

---

## API mapping

The factory produces a Storyblok `custom` field type with the following structure:

| Factory param | Plugin option | Value format |
|---------------|--------------|--------------|
| `enable_title` | `enableTitle` | `"true"` or `""` |
| `enable_line_number_start` | `enableLineNumberStart` | `"true"` or `""` |
| `languages` | `languages` | JSON-serialised string array |
| `highlight_states` | `highlightStates` | JSON-serialised `{ value, color }[]` (or `""` when omitted) |
