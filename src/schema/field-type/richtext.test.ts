import { describe, expect, it } from 'vitest';
import { richtext } from './richtext';

describe('richtext', () => {
  it('creates a richtext field with minimal params', () => {
    const result = richtext({
      name: 'content',
    });
    expect(result).toEqual({
      _name: 'content',
      type: 'richtext',
    });
  });

  it('includes all optional params', () => {
    const result = richtext({
      name: 'content',
      max_length: 10000,
      allow_target_blank: true,
      required: true,
    });
    expect(result).toEqual({
      _name: 'content',
      type: 'richtext',
      max_length: 10000,
      allow_target_blank: true,
      required: true,
    });
  });
});
