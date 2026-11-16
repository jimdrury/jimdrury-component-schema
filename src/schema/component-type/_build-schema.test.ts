import { describe, expect, it } from 'vitest';
import { boolean } from '../field-type/boolean';
import type { ConditionalSetting } from '../field-type/conditional-settings.interface';
import { number } from '../field-type/number';
import { tab } from '../field-type/tab';
import { buildSchema } from './_build-schema';

const hideWhen = (field_key: string): ConditionalSetting[] => [
  {
    rule_match: 'any',
    rule_conditions: [
      {
        validated_object: {
          type: 'field',
          field_key,
          field_attr: 'value',
        },
        validation: 'equals',
        value: true,
      },
    ],
    modifications: [
      {
        display: 'hide',
      },
    ],
  },
];

describe('buildSchema conditional settings', () => {
  it('accepts a condition on a sibling field inside a tab', () => {
    const schema = buildSchema([
      tab({
        name: 'product',
        display_name: 'Product',
        fields: [
          number({
            name: 'minutes',
            conditional_settings: hideWhen('minutes_unlimited'),
          }),
          boolean({
            name: 'minutes_unlimited',
          }),
        ],
      }),
    ]);

    expect(schema.minutes).toMatchObject({
      conditional_settings: hideWhen('minutes_unlimited'),
    });
  });

  it('rejects a condition on an unknown field', () => {
    expect(() =>
      buildSchema([
        number({
          name: 'minutes',
          conditional_settings: hideWhen('missing'),
        }),
      ]),
    ).toThrow(
      'Field "minutes" has a conditional setting on unknown field "missing"',
    );
  });

  it('rejects a condition on a tab', () => {
    expect(() =>
      buildSchema([
        number({
          name: 'minutes',
          conditional_settings: hideWhen('tab_product'),
        }),
        tab({
          name: 'product',
          display_name: 'Product',
          fields: [
            boolean({
              name: 'minutes_unlimited',
            }),
          ],
        }),
      ]),
    ).toThrow(
      'Field "minutes" has a conditional setting on unknown field "tab_product"',
    );
  });

  it('rejects a condition on the field itself', () => {
    expect(() =>
      buildSchema([
        number({
          name: 'minutes',
          conditional_settings: hideWhen('minutes'),
        }),
      ]),
    ).toThrow(
      'Field "minutes" has a conditional setting that depends on itself',
    );
  });
});
