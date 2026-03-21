import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverComponents } from './discover';

vi.mock('node:fs', () => ({
  default: {
    readdirSync: vi.fn(),
    existsSync: vi.fn(() => false),
  },
}));

function fileDirent(name: string): fs.Dirent {
  return {
    name,
    isDirectory: () => false,
    isFile: () => true,
  } as unknown as fs.Dirent;
}

function dirDirent(name: string): fs.Dirent {
  return {
    name,
    isDirectory: () => true,
    isFile: () => false,
  } as unknown as fs.Dirent;
}

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
    vi.mocked(fs.readdirSync).mockReturnValue([
      fileDirent('readme.md'),
      fileDirent('style.css'),
      fileDirent('data.json'),
    ] as never);
    const result = await discoverComponents('/tmp/components');
    expect(result).toEqual([]);
  });

  it('calls readdirSync with withFileTypes on the given directory', async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([] as never);
    await discoverComponents('/some/path');
    expect(fs.readdirSync).toHaveBeenCalledWith('/some/path', {
      withFileTypes: true,
    });
  });

  it('recurses into subdirectories', async () => {
    vi.mocked(fs.readdirSync).mockImplementation(((dir: string) => {
      if (dir === '/tmp/components') {
        return [
          dirDirent('layouts'),
        ] as never;
      }
      return [] as never;
    }) as typeof fs.readdirSync);

    await discoverComponents('/tmp/components');
    expect(fs.readdirSync).toHaveBeenCalledWith('/tmp/components/layouts', {
      withFileTypes: true,
    });
  });
});
