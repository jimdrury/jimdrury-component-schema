import { describe, expect, it } from 'vitest';
import { markdown } from './markdown';

describe('markdown', () => {
  it('creates a markdown field with minimal params', () => {
    const result = markdown({
      name: 'content',
    });
    expect(result).toEqual({
      _name: 'content',
      type: 'markdown',
    });
  });

  it('includes all optional params', () => {
    const result = markdown({
      name: 'content',
      max_length: 5000,
      rich_markdown: true,
      description: 'Markdown content',
    });
    expect(result).toEqual({
      _name: 'content',
      type: 'markdown',
      max_length: 5000,
      rich_markdown: true,
      description: 'Markdown content',
    });
  });
});
