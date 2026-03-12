import { describe, expect, it } from 'vitest';
import { number } from './number';

describe('number', () => {
  it('creates a number field with minimal params', () => {
    const result = number({
      name: 'count',
    });
    expect(result).toEqual({
      _name: 'count',
      type: 'number',
    });
  });

  it('includes all optional params', () => {
    const result = number({
      name: 'price',
      min_value: 0,
      max_value: 9999,
      decimals: 2,
      steps: 0.01,
      default_value: 0,
    });
    expect(result).toEqual({
      _name: 'price',
      type: 'number',
      min_value: 0,
      max_value: 9999,
      decimals: 2,
      steps: 0.01,
      default_value: 0,
    });
  });
});
