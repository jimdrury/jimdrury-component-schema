import { describe, expect, it } from 'vitest';
import { buildComponentPayload } from './payload';

describe('buildComponentPayload', () => {
  it('sends omitted optional settings as empty values', () => {
    const payload = buildComponentPayload(
      {
        name: 'hero',
        schema: {},
      },
      new Map(),
      new Map(),
    );

    expect(payload).toEqual({
      name: 'hero',
      schema: {},
      image: null,
      preview_field: null,
      preview_tmpl: null,
      icon: null,
      color: null,
      content_type_asset_preview: null,
      component_group_uuid: null,
      internal_tag_ids: [],
    });
  });

  it('sends set optional settings with folder and tags resolved', () => {
    const payload = buildComponentPayload(
      {
        name: 'blog',
        display_name: 'Blog',
        is_root: true,
        is_nestable: false,
        image: 'https://example.com/blog.png',
        preview_field: 'title',
        preview_tmpl: '{{ it.title }}',
        icon: 'block-doc',
        color: '#00b3b0',
        content_type_asset_preview: 'cover',
        folder: 'content',
        tags: [
          'marketing',
        ],
        schema: {},
      },
      new Map([
        [
          'content',
          'content-uuid',
        ],
      ]),
      new Map([
        [
          'marketing',
          7,
        ],
      ]),
    );

    expect(payload).toEqual({
      name: 'blog',
      display_name: 'Blog',
      is_root: true,
      is_nestable: false,
      schema: {},
      image: 'https://example.com/blog.png',
      preview_field: 'title',
      preview_tmpl: '{{ it.title }}',
      icon: 'block-doc',
      color: '#00b3b0',
      content_type_asset_preview: 'cover',
      component_group_uuid: 'content-uuid',
      internal_tag_ids: [
        7,
      ],
    });
  });

  it('throws for an unknown tag', () => {
    expect(() =>
      buildComponentPayload(
        {
          name: 'hero',
          tags: [
            'missing',
          ],
          schema: {},
        },
        new Map(),
        new Map(),
      ),
    ).toThrow('Unknown tag "missing" on component "hero"');
  });
});
