import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { discoverComponents } from './discover';

describe('discoverComponents (integration)', () => {
  it('imports .ts files and returns their default exports', async () => {
    const fixturesDir = path.resolve(import.meta.dirname, '__fixtures__/components');
    const result = await discoverComponents(fixturesDir);

    expect(result).toHaveLength(2);

    const names = result.map((c) => c.name).sort();
    expect(names).toEqual(['article', 'hero']);

    const hero = result.find((c) => c.name === 'hero');
    expect(hero).toEqual({
      name: 'hero',
      display_name: 'Hero',
      schema: {},
      is_root: false,
      is_nestable: true,
    });

    const article = result.find((c) => c.name === 'article');
    expect(article).toEqual({
      name: 'article',
      display_name: 'Article',
      schema: {},
      is_root: true,
    });
  });
});
