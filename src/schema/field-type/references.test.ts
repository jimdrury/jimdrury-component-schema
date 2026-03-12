import { describe, expect, it } from 'vitest';
import { references } from './references';

describe('references', () => {
  it('creates a references field with minimal params', () => {
    const result = references({
      name: 'related',
    });
    expect(result).toEqual({
      _name: 'related',
      type: 'options',
      is_reference_type: true,
      source: 'internal_stories',
    });
  });

  it('includes all optional params', () => {
    const result = references({
      name: 'related',
      filter_content_type: [
        {
          name: 'blog',
        },
        {
          name: 'article',
        },
      ],
      folder_slug: '/home',
      entry_appearance: 'card',
      allow_advanced_search: true,
    });
    expect(result).toEqual({
      _name: 'related',
      type: 'options',
      is_reference_type: true,
      source: 'internal_stories',
      filter_content_type: [
        'blog',
        'article',
      ],
      folder_slug: '/home',
      entry_appearance: 'card',
      allow_advanced_search: true,
    });
  });

  it('supports link entry appearance', () => {
    const result = references({
      name: 'posts',
      entry_appearance: 'link',
    });
    expect(result).toEqual({
      _name: 'posts',
      type: 'options',
      is_reference_type: true,
      source: 'internal_stories',
      entry_appearance: 'link',
    });
  });

  it('transforms filter_content_type component refs to name strings', () => {
    const result = references({
      name: 'items',
      filter_content_type: [
        {
          name: 'page',
        },
      ],
    });
    expect(result.filter_content_type).toEqual([
      'page',
    ]);
  });

  it('does not include filter_content_type when not provided', () => {
    const result = references({
      name: 'items',
    });
    expect(result).not.toHaveProperty('filter_content_type');
  });
});
