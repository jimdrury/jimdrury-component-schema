import { describe, expect, it } from 'vitest';
import {
  CreateComponentFolderSchema,
  CreateComponentSchema,
  CreateInternalTagSchema,
  GetComponentFoldersSchema,
  GetComponentsSchema,
  GetInternalTagsSchema,
  UpdateComponentFolderSchema,
  UpdateComponentSchema,
} from './storyblok.interface';

describe('GetComponentsSchema', () => {
  it('accepts empty params', () => {
    expect(GetComponentsSchema.parse({})).toEqual({});
  });

  it('accepts all optional params', () => {
    const params = {
      by_ids: [
        '1',
        '2',
      ],
      sort_by: 'name',
      is_root: true,
      search: 'hero',
      in_group: '550e8400-e29b-41d4-a716-446655440000',
    };
    const result = GetComponentsSchema.parse(params);
    expect(result).toEqual(params);
  });

  it('strips unknown keys', () => {
    const result = GetComponentsSchema.parse({
      unknown_key: 'value',
    });
    expect(result).not.toHaveProperty('unknown_key');
  });
});

describe('CreateComponentSchema', () => {
  it('accepts minimal params', () => {
    const result = CreateComponentSchema.parse({
      name: 'hero',
    });
    expect(result.name).toBe('hero');
  });

  it('accepts all optional params', () => {
    const params = {
      name: 'hero',
      display_name: 'Hero',
      schema: {
        title: {
          type: 'text',
        },
      },
      image: 'https://example.com/icon.png',
      preview_field: 'title',
      is_root: true,
      preview_tmpl: '<p>{{ title }}</p>',
      is_nestable: false,
      component_group_uuid: 'abc-123',
      icon: 'block-image',
      color: '#ff0000',
      internal_tag_ids: [
        1,
        2,
      ],
      content_type_asset_preview: 'image',
    };
    const result = CreateComponentSchema.parse(params);
    expect(result).toEqual(params);
  });

  it('rejects missing name', () => {
    expect(() => CreateComponentSchema.parse({})).toThrow();
  });
});

describe('UpdateComponentSchema', () => {
  it('accepts minimal params with id', () => {
    const result = UpdateComponentSchema.parse({
      id: 123,
    });
    expect(result.id).toBe(123);
  });

  it('accepts all optional params', () => {
    const params = {
      id: 123,
      name: 'hero',
      display_name: 'Hero',
      schema: {
        title: {
          type: 'text',
        },
      },
      is_root: false,
      is_nestable: true,
      internal_tag_ids: [
        1,
      ],
    };
    const result = UpdateComponentSchema.parse(params);
    expect(result).toEqual(params);
  });

  it('rejects missing id', () => {
    expect(() =>
      UpdateComponentSchema.parse({
        name: 'hero',
      }),
    ).toThrow();
  });
});

describe('GetComponentFoldersSchema', () => {
  it('accepts empty params', () => {
    expect(GetComponentFoldersSchema.parse({})).toEqual({});
  });

  it('accepts search and with_parent', () => {
    const result = GetComponentFoldersSchema.parse({
      search: 'layout',
      with_parent: '123',
    });
    expect(result).toEqual({
      search: 'layout',
      with_parent: '123',
    });
  });
});

describe('CreateComponentFolderSchema', () => {
  it('accepts minimal params', () => {
    const result = CreateComponentFolderSchema.parse({
      name: 'layout',
    });
    expect(result.name).toBe('layout');
  });

  it('accepts parent_id', () => {
    const result = CreateComponentFolderSchema.parse({
      name: 'layout',
      parent_id: 42,
    });
    expect(result).toEqual({
      name: 'layout',
      parent_id: 42,
    });
  });

  it('rejects missing name', () => {
    expect(() => CreateComponentFolderSchema.parse({})).toThrow();
  });
});

describe('UpdateComponentFolderSchema', () => {
  it('accepts minimal params with id', () => {
    const result = UpdateComponentFolderSchema.parse({
      id: 1,
    });
    expect(result.id).toBe(1);
  });

  it('accepts name and parent_id', () => {
    const result = UpdateComponentFolderSchema.parse({
      id: 1,
      name: 'ui',
      parent_id: 2,
    });
    expect(result).toEqual({
      id: 1,
      name: 'ui',
      parent_id: 2,
    });
  });
});

describe('GetInternalTagsSchema', () => {
  it('accepts empty params', () => {
    expect(GetInternalTagsSchema.parse({})).toEqual({});
  });

  it('accepts by_object_type', () => {
    const result = GetInternalTagsSchema.parse({
      by_object_type: 'component',
    });
    expect(result).toEqual({
      by_object_type: 'component',
    });
  });
});

describe('CreateInternalTagSchema', () => {
  it('accepts valid params', () => {
    const result = CreateInternalTagSchema.parse({
      name: 'layout',
      object_type: 'component',
    });
    expect(result).toEqual({
      name: 'layout',
      object_type: 'component',
    });
  });

  it('rejects missing name', () => {
    expect(() =>
      CreateInternalTagSchema.parse({
        object_type: 'component',
      }),
    ).toThrow();
  });

  it('rejects invalid object_type', () => {
    expect(() =>
      CreateInternalTagSchema.parse({
        name: 'test',
        object_type: 'story',
      }),
    ).toThrow();
  });

  it('rejects missing object_type', () => {
    expect(() =>
      CreateInternalTagSchema.parse({
        name: 'test',
      }),
    ).toThrow();
  });
});
