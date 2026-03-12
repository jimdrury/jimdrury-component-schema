import { describe, expect, it } from 'vitest';
import { table } from './table';

describe('table', () => {
  it('creates a table field with minimal params', () => {
    const result = table({
      name: 'data',
    });
    expect(result).toEqual({
      _name: 'data',
      type: 'table',
    });
  });

  it('includes base field params', () => {
    const result = table({
      name: 'data',
      description: 'Table data',
      required: true,
    });
    expect(result).toEqual({
      _name: 'data',
      type: 'table',
      description: 'Table data',
      required: true,
    });
  });
});
