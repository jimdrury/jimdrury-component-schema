import { describe, expect, it } from 'vitest';
import { boolean } from './boolean';
import { number } from './number';
import { text } from './text';

const unlimited = {
  type: 'field',
  field_key: 'minutes_unlimited',
  field_attr: 'value',
} as const;

describe('conditional_settings', () => {
  it('passes a hide rule through to the field', () => {
    const result = number({
      name: 'minutes',
      required: true,
      conditional_settings: [
        {
          rule_match: 'any',
          rule_conditions: [
            {
              validated_object: unlimited,
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
      ],
    });

    expect(result).toEqual({
      _name: 'minutes',
      type: 'number',
      required: true,
      conditional_settings: [
        {
          rule_match: 'any',
          rule_conditions: [
            {
              validated_object: unlimited,
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
      ],
    });
  });

  it('accepts a required modification', () => {
    const result = text({
      name: 'note',
      conditional_settings: [
        {
          rule_match: 'all',
          rule_conditions: [
            {
              validated_object: unlimited,
              validation: 'not_empty',
            },
          ],
          modifications: [
            {
              required: true,
            },
          ],
        },
      ],
    });

    expect(result.conditional_settings?.[0]?.modifications).toEqual([
      {
        required: true,
      },
    ]);
  });

  it('accepts gt and lt comparisons against numbers and dates', () => {
    expect(() =>
      boolean({
        name: 'flag',
        conditional_settings: [
          {
            rule_match: 'all',
            rule_conditions: [
              {
                validated_object: unlimited,
                validation: 'gt',
                value: 10,
              },
              {
                validated_object: unlimited,
                validation: 'lt',
                value: '2026-12-31 00:00',
              },
            ],
            modifications: [
              {
                display: 'hidden',
              },
            ],
          },
        ],
      }),
    ).not.toThrow();
  });

  it('rejects a modification that both hides and sets required', () => {
    expect(() =>
      number({
        name: 'minutes',
        conditional_settings: [
          {
            rule_match: 'any',
            rule_conditions: [
              {
                validated_object: unlimited,
                validation: 'equals',
                value: true,
              },
            ],
            modifications: [
              // @ts-expect-error a modification sets display or required, not both
              {
                display: 'hide',
                required: false,
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });

  it('rejects an equality condition without a value', () => {
    expect(() =>
      number({
        name: 'minutes',
        conditional_settings: [
          {
            rule_match: 'any',
            rule_conditions: [
              // @ts-expect-error equals needs a value to compare against
              {
                validated_object: unlimited,
                validation: 'equals',
              },
            ],
            modifications: [
              {
                display: 'hide',
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });

  it('rejects a setting without conditions or modifications', () => {
    expect(() =>
      number({
        name: 'minutes',
        conditional_settings: [
          {
            rule_match: 'any',
            rule_conditions: [],
            modifications: [],
          },
        ],
      }),
    ).toThrow();
  });

  it('rejects an empty list of settings', () => {
    expect(() =>
      number({
        name: 'minutes',
        conditional_settings: [],
      }),
    ).toThrow();
  });
});
