import { describe, expect, it } from 'vitest';
import { option } from './option';

describe('option', () => {
  const opts = [
    {
      name: 'Red',
      value: 'red',
    },
    {
      name: 'Blue',
      value: 'blue',
    },
  ];

  it('creates an option field with minimal params', () => {
    const result = option({
      name: 'color',
      options: opts,
    });
    expect(result).toEqual({
      _name: 'color',
      type: 'option',
      options: opts,
    });
  });

  it('includes all optional params', () => {
    const result = option({
      name: 'color',
      options: opts,
      default_value: 'red',
      use_uuid: true,
      source: 'internal',
      datasource_slug: 'colors',
      external_datasource: 'https://example.com/colors',
      filter_content_type: [
        'page',
      ],
      folder_slug: 'colors',
    });
    expect(result).toEqual({
      _name: 'color',
      type: 'option',
      options: opts,
      default_value: 'red',
      use_uuid: true,
      source: 'internal',
      datasource_slug: 'colors',
      external_datasource: 'https://example.com/colors',
      filter_content_type: [
        'page',
      ],
      folder_slug: 'colors',
    });
  });
});
