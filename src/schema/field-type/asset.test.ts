import { describe, expect, it } from 'vitest';
import { asset } from './asset';

describe('asset', () => {
  it('creates an asset field with minimal params', () => {
    const result = asset({ name: 'image' });
    expect(result).toEqual({ _name: 'image', type: 'asset' });
  });

  it('includes all optional params', () => {
    const result = asset({
      name: 'image',
      filetypes: ['images'],
      allow_external_url: true,
    });
    expect(result).toEqual({
      _name: 'image',
      type: 'asset',
      filetypes: ['images'],
      allow_external_url: true,
    });
  });
});
