import { describe, expect, it } from 'vitest';
import { asset } from '../field-type/asset';
import { richtext } from '../field-type/richtext';
import { text } from '../field-type/text';
import { universal } from './universal';

describe('universal', () => {
  it('creates a universal component with minimal params', () => {
    const result = universal({
      name: 'faq',
      display_name: 'FAQ',
      schema: [
        text({
          name: 'question',
        }),
      ],
    });

    expect(result).toEqual({
      name: 'faq',
      display_name: 'FAQ',
      image: undefined,
      preview_field: undefined,
      folder: undefined,
      tags: undefined,
      schema: {
        question: {
          type: 'text',
        },
      },
      is_root: true,
      is_nestable: true,
    });
  });

  it('sets is_root to true and is_nestable to true', () => {
    const result = universal({
      name: 'faq',
      display_name: 'FAQ',
      schema: [],
    });
    expect(result.is_root).toBe(true);
    expect(result.is_nestable).toBe(true);
  });

  it('flattens schema array into a record keyed by _name', () => {
    const result = universal({
      name: 'faq',
      display_name: 'FAQ',
      schema: [
        text({
          name: 'question',
          required: true,
        }),
        richtext({
          name: 'answer',
        }),
      ],
    });

    expect(result.schema).toEqual({
      question: {
        type: 'text',
        required: true,
      },
      answer: {
        type: 'richtext',
      },
    });
  });

  it('includes all optional params', () => {
    const result = universal({
      name: 'faq',
      display_name: 'FAQ',
      image: 'https://example.com/faq.png',
      preview_field: 'question',
      folder: 'content',
      tags: [
        'content',
      ],
      schema: [],
    });

    expect(result.image).toBe('https://example.com/faq.png');
    expect(result.preview_field).toBe('question');
    expect(result.folder).toBe('content');
    expect(result.tags).toEqual([
      'content',
    ]);
  });

  it('includes editor display settings', () => {
    const result = universal({
      name: 'faq',
      display_name: 'FAQ',
      description: 'Shown to editors.',
      icon: 'block-comment',
      color: '#ff5c00',
      preview_tmpl: '{{ it.question }}',
      content_type_asset_preview: 'image',
      schema: [
        asset({
          name: 'image',
        }),
      ],
    });

    expect(result.description).toBe('Shown to editors.');
    expect(result.icon).toBe('block-comment');
    expect(result.color).toBe('#ff5c00');
    expect(result.preview_tmpl).toBe('{{ it.question }}');
    expect(result.content_type_asset_preview).toBe('image');
  });

  it('rejects content_type_asset_preview that does not name an asset field', () => {
    expect(() =>
      universal({
        name: 'faq',
        display_name: 'FAQ',
        content_type_asset_preview: 'question',
        schema: [
          text({
            name: 'question',
          }),
        ],
      }),
    ).toThrow('content_type_asset_preview "question" must name an asset field');
  });

  it('rejects invalid names', () => {
    expect(() =>
      universal({
        name: 'My FAQ' as never,
        display_name: 'My FAQ',
        schema: [],
      }),
    ).toThrow();
  });
});
