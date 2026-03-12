import { describe, expect, it } from 'vitest';
import { textarea } from './textarea';

describe('textarea', () => {
  it('creates a textarea field with minimal params', () => {
    const result = textarea({
      name: 'body',
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'textarea',
    });
  });

  it('includes all optional params', () => {
    const result = textarea({
      name: 'body',
      description: 'Body text',
      required: true,
      default_value: 'Enter text...',
      max_length: 500,
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'textarea',
      description: 'Body text',
      required: true,
      default_value: 'Enter text...',
      max_length: 500,
    });
  });

  it('rejects invalid names', () => {
    expect(() =>
      textarea({
        name: 'Bad-Name',
      }),
    ).toThrow();
  });
});
