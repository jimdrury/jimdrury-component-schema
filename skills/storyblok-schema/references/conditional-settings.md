---
name: conditional-settings
description: >-
  Use the conditional_settings base parameter to hide a field, or change
  whether it is required, based on the value of a sibling field. Use when a
  field only applies in some cases, or when copying a conditional rule set up
  in the Storyblok editor into a schema file.
---

# conditional_settings

Every field factory accepts `conditional_settings`. It uses Storyblok's own
shape, so a rule saved in the editor can be copied from the component JSON
into the schema file as-is.

## Example

Hide `minutes` when `minutes_unlimited` is ticked:

```ts
number({
  name: "minutes",
  min_value: 0,
  decimals: 0,
  conditional_settings: [
    {
      rule_match: "any",
      rule_conditions: [
        {
          validated_object: {
            type: "field",
            field_key: "minutes_unlimited",
            field_attr: "value",
          },
          validation: "equals",
          value: true,
        },
      ],
      modifications: [{ display: "hide" }],
    },
  ],
}),
boolean({ name: "minutes_unlimited", inline_label: true }),
```

## Shape

| Key               | Type                 | Description                                                        |
| ----------------- | -------------------- | ------------------------------------------------------------------ |
| `rule_match`      | `"all"` \| `"any"`   | Whether every condition must match, or any one of them.            |
| `rule_conditions` | `RuleCondition[]`    | At least one condition, each read from a sibling field.            |
| `modifications`   | `Modification[]`     | At least one change to apply to this field when the rule matches. |

### Rule conditions

`validated_object` is always `{ type: "field", field_key, field_attr: "value" }`.
`field_key` must name another field in the same component (a field inside a
`tab()` counts). The component builder throws if it names an unknown field, a
tab, or the field itself.

| `validation`              | `value`                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `equals`, `not_equals`    | Required. A string, number, or boolean, or an asset object for an `asset` field. |
| `empty`, `not_empty`      | Omit it (or `null`).                                                        |
| `gt`, `lt`                | Required. A number, or a date string in `YYYY-MM-DD HH:mm` format.          |

Match the value to the sibling field: `true`/`false` for `boolean()`, the
option value for `option()`, a number for `number()`.

### Modifications

Each modification sets exactly one of:

| Key        | Values                 | Effect                                       |
| ---------- | ---------------------- | -------------------------------------------- |
| `display`  | `"hide"` \| `"hidden"` | Hides the field.                             |
| `required` | `boolean`              | Makes the field required, or not required.   |

## Editor and server behaviour

- Write one setting with one modification. The editor writes and reads only
  the first of each. Extra settings are not ignored on the server: its
  conditional-required check needs every setting to match.
- Use `display: "hide"` for anything editors open. The editor only understands
  `hide`. The server's required check only understands `hidden`, so a field
  with `required: true` and a `hide` rule is still required on save while it
  is hidden. If a hidden field must be allowed to stay empty, leave
  field-level `required` off, or require it with a separate rule instead.

## Plan and apply

`plan` always compares `conditional_settings`, including rules that exist
only in Storyblok. Leaving it out of a field means the field has no rules, so
`apply` removes any rule added in the editor. Copy editor-made rules into the
schema file before applying.
