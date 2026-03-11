import { describe, expect, it } from 'vitest';
import { richtext } from '../field-type/richtext';
import { tab } from '../field-type/tab';
import { text } from '../field-type/text';
import { contentType } from './content-type';

describe('contentType', () => {
  it('creates a content type with minimal params', () => {
    const result = contentType({
      name: 'page',
      display_name: 'Page',
      schema: [text({ name: 'title' })],
    });

    expect(result).toEqual({
      name: 'page',
      display_name: 'Page',
      image: undefined,
      preview_field: undefined,
      folder: undefined,
      tags: undefined,
      schema: {
        title: { type: 'text' },
      },
      is_root: true,
    });
  });

  it('sets is_root to true', () => {
    const result = contentType({
      name: 'page',
      display_name: 'Page',
      schema: [],
    });
    expect(result.is_root).toBe(true);
  });

  it('flattens schema array into a record keyed by _name', () => {
    const result = contentType({
      name: 'blog',
      display_name: 'Blog',
      schema: [text({ name: 'title', required: true }), richtext({ name: 'content' })],
    });

    expect(result.schema).toEqual({
      title: { type: 'text', required: true },
      content: { type: 'richtext' },
    });
  });

  it('includes all optional params', () => {
    const result = contentType({
      name: 'blog',
      display_name: 'Blog',
      image: 'https://example.com/icon.png',
      preview_field: 'title',
      folder: 'content',
      tags: ['content'],
      schema: [text({ name: 'title' })],
    });

    expect(result.name).toBe('blog');
    expect(result.display_name).toBe('Blog');
    expect(result.image).toBe('https://example.com/icon.png');
    expect(result.preview_field).toBe('title');
    expect(result.folder).toBe('content');
    expect(result.tags).toEqual(['content']);
  });

  it('rejects invalid names', () => {
    expect(() =>
      contentType({
        name: 'My Page' as never,
        display_name: 'My Page',
        schema: [],
      }),
    ).toThrow();
  });

  it('rejects invalid field types in schema', () => {
    expect(() =>
      contentType({
        name: 'page',
        display_name: 'Page',
        schema: [{ invalid: true } as never],
      }),
    ).toThrow();
  });

  it('flattens tab fields into schema with tab entry', () => {
    const result = contentType({
      name: 'page',
      display_name: 'Page',
      schema: [
        richtext({ name: 'body' }),
        tab({
          name: 'seo',
          display_name: 'SEO',
          fields: [text({ name: 'meta_title' }), text({ name: 'meta_description' })],
        }),
      ],
    });

    expect(result.schema).toEqual({
      body: { type: 'richtext' },
      meta_title: { type: 'text' },
      meta_description: { type: 'text' },
      tab_seo: {
        type: 'tab',
        display_name: 'SEO',
        keys: ['meta_title', 'meta_description'],
      },
    });
  });

  it('supports multiple tabs', () => {
    const result = contentType({
      name: 'page',
      display_name: 'Page',
      schema: [
        text({ name: 'title' }),
        tab({
          name: 'seo',
          display_name: 'SEO',
          fields: [text({ name: 'meta_title' })],
        }),
        tab({
          name: 'config',
          display_name: 'Config',
          fields: [text({ name: 'slug' })],
        }),
      ],
    });

    expect(result.schema).toEqual({
      title: { type: 'text' },
      meta_title: { type: 'text' },
      tab_seo: { type: 'tab', display_name: 'SEO', keys: ['meta_title'] },
      slug: { type: 'text' },
      tab_config: { type: 'tab', display_name: 'Config', keys: ['slug'] },
    });
  });
});
