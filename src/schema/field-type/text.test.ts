import { describe, expect, it } from 'vitest';
import { text } from './text';

describe('text', () => {
  it('creates a text field with minimal params', () => {
    const result = text({ name: 'title' });
    expect(result).toEqual({ _name: 'title', type: 'text' });
  });

  it('includes all optional params', () => {
    const result = text({
      name: 'title',
      description: 'Page title',
      tooltip: true,
      required: true,
      translatable: true,
      default_value: 'Untitled',
      max_length: 100,
      regex: '^[A-Z]',
    });
    expect(result).toEqual({
      _name: 'title',
      type: 'text',
      description: 'Page title',
      tooltip: true,
      required: true,
      translatable: true,
      default_value: 'Untitled',
      max_length: 100,
      regex: '^[A-Z]',
    });
  });

  it('rejects invalid names with uppercase', () => {
    expect(() => text({ name: 'Title' as never })).toThrow();
  });

  it('rejects names with spaces', () => {
    expect(() => text({ name: 'my title' as never })).toThrow();
  });

  it('rejects names with numbers', () => {
    expect(() => text({ name: 'title1' as never })).toThrow();
  });

  it('allows underscores in names', () => {
    const result = text({ name: 'my_title' });
    expect(result._name).toBe('my_title');
  });
});
