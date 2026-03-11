import { describe, expect, it } from 'vitest';
import { multilink } from './multilink';

describe('multilink', () => {
  it('creates a multilink field with minimal params', () => {
    const result = multilink({ name: 'link' });
    expect(result).toEqual({ _name: 'link', type: 'multilink' });
  });

  it('includes all optional params', () => {
    const result = multilink({
      name: 'link',
      email_link_type: true,
      asset_link_type: true,
      show_anchor: true,
      allow_target_blank: true,
      allow_custom_attributes: true,
      force_link_scope: true,
    });
    expect(result).toEqual({
      _name: 'link',
      type: 'multilink',
      email_link_type: true,
      asset_link_type: true,
      show_anchor: true,
      allow_target_blank: true,
      allow_custom_attributes: true,
      force_link_scope: true,
    });
  });

  it('transforms allowed_content_types into restrict_content_types and component_whitelist', () => {
    const result = multilink({
      name: 'link',
      allowed_content_types: [{ name: 'page' }, { name: 'blog' }],
    });
    expect(result).toEqual({
      _name: 'link',
      type: 'multilink',
      restrict_content_types: true,
      component_whitelist: ['page', 'blog'],
    });
  });

  it('does not include restrict_content_types when allowed_content_types is not provided', () => {
    const result = multilink({ name: 'link' });
    expect(result).not.toHaveProperty('restrict_content_types');
    expect(result).not.toHaveProperty('component_whitelist');
  });
});
