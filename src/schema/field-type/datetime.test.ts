import { describe, expect, it } from 'vitest';
import { datetime } from './datetime';

describe('datetime', () => {
  it('creates a datetime field with minimal params', () => {
    const result = datetime({ name: 'published_at' });
    expect(result).toEqual({ _name: 'published_at', type: 'datetime' });
  });

  it('includes all optional params', () => {
    const result = datetime({
      name: 'published_at',
      disable_time: true,
      default_value: '2024-01-01',
    });
    expect(result).toEqual({
      _name: 'published_at',
      type: 'datetime',
      disable_time: true,
      default_value: '2024-01-01',
    });
  });
});
