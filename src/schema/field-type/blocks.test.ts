import { describe, expect, it } from 'vitest';
import { blocks } from './blocks';

describe('blocks', () => {
  it('creates a blocks field with minimal params', () => {
    const result = blocks({ name: 'body' });
    expect(result).toEqual({ _name: 'body', type: 'bloks' });
  });

  it('includes minimum and maximum', () => {
    const result = blocks({ name: 'body', minimum: 1, maximum: 10 });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      minimum: 1,
      maximum: 10,
    });
  });

  it('handles allowed_components restriction', () => {
    const result = blocks({
      name: 'body',
      allowed_components: [{ name: 'text' }, { name: 'image' }],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      restrict_type: '',
      restrict_components: true,
      component_whitelist: ['text', 'image'],
      component_denylist: [],
    });
  });

  it('handles disallowed_components restriction', () => {
    const result = blocks({
      name: 'body',
      disallowed_components: [{ name: 'secret' }],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      restrict_type: '',
      restrict_components: true,
      component_whitelist: [],
      component_denylist: ['secret'],
    });
  });

  it('handles allowed_folders restriction', () => {
    const result = blocks({
      name: 'body',
      allowed_folders: ['content/pages'],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      _allowed_folders: ['content/pages'],
    });
  });

  it('handles disallowed_folders restriction', () => {
    const result = blocks({
      name: 'body',
      disallowed_folders: ['internal'],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      _disallowed_folders: ['internal'],
    });
  });

  it('handles allowed_tags restriction', () => {
    const result = blocks({
      name: 'body',
      allowed_tags: ['layout'],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      _allowed_tags: ['layout'],
    });
  });

  it('handles disallowed_tags restriction', () => {
    const result = blocks({
      name: 'body',
      disallowed_tags: ['internal'],
    });
    expect(result).toEqual({
      _name: 'body',
      type: 'bloks',
      _disallowed_tags: ['internal'],
    });
  });

  it('rejects multiple restriction types', () => {
    expect(() =>
      blocks({
        name: 'body',
        allowed_components: [{ name: 'text' }],
        allowed_tags: ['layout'],
      } as never),
    ).toThrow();
  });
});
