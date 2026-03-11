import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverComponents } from './discover';

vi.mock('node:fs', () => ({
  default: {
    readdirSync: vi.fn(),
  },
}));

describe('discoverComponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty array when directory has no .ts files', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([] as never);
    const result = await discoverComponents('/tmp/components');
    expect(result).toEqual([]);
  });

  it('filters out non-.ts files', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue(['readme.md', 'style.css', 'data.json'] as never);
    const result = await discoverComponents('/tmp/components');
    expect(result).toEqual([]);
  });

  it('calls readdirSync on the given directory', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([] as never);
    await discoverComponents('/some/path');
    expect(fs.readdirSync).toHaveBeenCalledWith('/some/path');
  });
});
