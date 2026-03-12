import { describe, expect, it } from 'vitest';
import { options } from './options';

describe('options', () => {
  const opts = [
    {
      name: 'Tag A',
      value: 'a',
    },
    {
      name: 'Tag B',
      value: 'b',
    },
  ];

  it('creates an options field with minimal params', () => {
    const result = options({
      name: 'tags',
      options: opts,
    });
    expect(result).toEqual({
      _name: 'tags',
      type: 'options',
      options: opts,
    });
  });

  it('includes all optional params', () => {
    const result = options({
      name: 'tags',
      options: opts,
      default_value: [
        'a',
      ],
      min_options: 1,
      max_options: 3,
      use_uuid: true,
      source: 'external',
    });
    expect(result).toEqual({
      _name: 'tags',
      type: 'options',
      options: opts,
      default_value: [
        'a',
      ],
      min_options: 1,
      max_options: 3,
      use_uuid: true,
      source: 'external',
    });
  });
});
