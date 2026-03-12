import { describe, expect, it } from 'vitest';
import { multiasset } from './multiasset';

describe('multiasset', () => {
  it('creates a multiasset field with minimal params', () => {
    const result = multiasset({
      name: 'gallery',
    });
    expect(result).toEqual({
      _name: 'gallery',
      type: 'multiasset',
    });
  });

  it('includes all optional params', () => {
    const result = multiasset({
      name: 'gallery',
      filetypes: [
        'images',
        'videos',
      ],
      allow_external_url: true,
    });
    expect(result).toEqual({
      _name: 'gallery',
      type: 'multiasset',
      filetypes: [
        'images',
        'videos',
      ],
      allow_external_url: true,
    });
  });
});
