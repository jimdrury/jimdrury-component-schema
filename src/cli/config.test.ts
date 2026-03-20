import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from './config';

const TMP_DIR = path.resolve(import.meta.dirname, '__fixtures__/config-test');
const CONFIG_PATH = path.join(TMP_DIR, '.component-schema.yaml');

beforeEach(() => {
  fs.mkdirSync(TMP_DIR, {
    recursive: true,
  });
});

afterEach(() => {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
  vi.unstubAllEnvs();
});

describe('loadConfig', () => {
  it('returns empty config when no file exists', () => {
    const config = loadConfig(TMP_DIR);
    expect(config).toEqual({});
  });

  it('parses a full config file', () => {
    fs.writeFileSync(
      CONFIG_PATH,
      [
        'componentsDir: ./my-components',
        'storyblok:',
        '  apiToken: my-token',
        '  spaceId: "12345"',
      ].join('\n'),
    );

    const config = loadConfig(TMP_DIR);
    expect(config).toEqual({
      componentsDir: './my-components',
      storyblok: {
        apiToken: 'my-token',
        spaceId: '12345',
      },
    });
  });

  it('interpolates environment variables', () => {
    vi.stubEnv('SB_TOKEN', 'secret-token');
    vi.stubEnv('SB_SPACE', '99999');

    const yaml = [
      'storyblok:',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: YAML env var syntax
      '  apiToken: "${SB_TOKEN}"',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: YAML env var syntax
      '  spaceId: "${SB_SPACE}"',
    ].join('\n');
    fs.writeFileSync(CONFIG_PATH, yaml);

    const config = loadConfig(TMP_DIR);
    expect(config.storyblok).toEqual({
      apiToken: 'secret-token',
      spaceId: '99999',
    });
  });

  it('throws when referencing an unset environment variable', () => {
    const yaml = [
      'storyblok:',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: YAML env var syntax
      '  apiToken: "${MISSING_VAR}"',
    ].join('\n');
    fs.writeFileSync(CONFIG_PATH, yaml);

    expect(() => loadConfig(TMP_DIR)).toThrow(
      'Environment variable "MISSING_VAR"',
    );
  });

  it('allows partial config (componentsDir only)', () => {
    fs.writeFileSync(CONFIG_PATH, 'componentsDir: ./src/blocks\n');

    const config = loadConfig(TMP_DIR);
    expect(config).toEqual({
      componentsDir: './src/blocks',
    });
  });

  it('returns empty config for an empty file', () => {
    fs.writeFileSync(CONFIG_PATH, '');

    const config = loadConfig(TMP_DIR);
    expect(config).toEqual({});
  });

  it('rejects unknown top-level keys', () => {
    fs.writeFileSync(CONFIG_PATH, 'unknown: value\n');

    expect(() => loadConfig(TMP_DIR)).toThrow();
  });
});
