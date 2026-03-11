import { describe, expect, it } from 'vitest';
import { boolean } from './boolean';

describe('boolean', () => {
  it('creates a boolean field with minimal params', () => {
    const result = boolean({ name: 'is_active' });
    expect(result).toEqual({ _name: 'is_active', type: 'boolean' });
  });

  it('includes all optional params', () => {
    const result = boolean({
      name: 'is_active',
      default_value: true,
      inline_label: true,
    });
    expect(result).toEqual({
      _name: 'is_active',
      type: 'boolean',
      default_value: true,
      inline_label: true,
    });
  });
});
