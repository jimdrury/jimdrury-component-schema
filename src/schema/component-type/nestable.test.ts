import { describe, expect, it } from 'vitest';
import { blocks } from '../field-type/blocks';
import { boolean } from '../field-type/boolean';
import { text } from '../field-type/text';
import { nestable } from './nestable';

describe('nestable', () => {
  it('creates a nestable component with minimal params', () => {
    const result = nestable({
      name: 'card',
      display_name: 'Card',
      schema: [
        text({
          name: 'title',
        }),
      ],
    });

    expect(result).toEqual({
      name: 'card',
      display_name: 'Card',
      image: undefined,
      preview_field: undefined,
      folder: undefined,
      tags: undefined,
      schema: {
        title: {
          type: 'text',
        },
      },
      is_root: false,
      is_nestable: true,
    });
  });

  it('sets is_root to false and is_nestable to true', () => {
    const result = nestable({
      name: 'card',
      display_name: 'Card',
      schema: [],
    });
    expect(result.is_root).toBe(false);
    expect(result.is_nestable).toBe(true);
  });

  it('flattens schema array into a record keyed by _name', () => {
    const result = nestable({
      name: 'hero',
      display_name: 'Hero',
      schema: [
        text({
          name: 'heading',
        }),
        boolean({
          name: 'is_featured',
        }),
        blocks({
          name: 'children',
        }),
      ],
    });

    expect(Object.keys(result.schema)).toEqual([
      'heading',
      'is_featured',
      'children',
    ]);
    expect(result.schema.heading).toEqual({
      type: 'text',
    });
    expect(result.schema.is_featured).toEqual({
      type: 'boolean',
    });
    expect(result.schema.children).toEqual({
      type: 'bloks',
    });
  });

  it('includes all optional params', () => {
    const result = nestable({
      name: 'card',
      display_name: 'Card',
      image: 'https://example.com/card.png',
      preview_field: 'title',
      folder: 'ui',
      tags: [
        'ui',
        'content',
      ],
      schema: [],
    });

    expect(result.folder).toBe('ui');
    expect(result.tags).toEqual([
      'ui',
      'content',
    ]);
    expect(result.image).toBe('https://example.com/card.png');
    expect(result.preview_field).toBe('title');
  });

  it('rejects invalid names', () => {
    expect(() =>
      nestable({
        name: 'MyCard' as never,
        display_name: 'My Card',
        schema: [],
      }),
    ).toThrow();
  });
});
