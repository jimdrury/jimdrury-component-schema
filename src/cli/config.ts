import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import z from 'zod';

const CONFIG_FILENAME = '.component-schema.yaml';

const ConfigSchema = z
  .object({
    componentsDir: z.string().optional(),
    storyblok: z
      .object({
        apiToken: z.string().optional(),
        spaceId: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;

function interpolateEnvVars(value: string): string {
  return value.replace(/\$\{([^}]+)}/g, (_match, varName: string) => {
    const envValue = process.env[varName];
    if (envValue === undefined) {
      throw new Error(
        `Environment variable "${varName}" referenced in ${CONFIG_FILENAME} is not set`,
      );
    }
    return envValue;
  });
}

function interpolateDeep(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return interpolateEnvVars(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(interpolateDeep);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = interpolateDeep(value);
    }
    return result;
  }
  return obj;
}

export function loadConfig(cwd: string = process.cwd()): Config {
  const configPath = path.resolve(cwd, CONFIG_FILENAME);

  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const parsed = parseYaml(raw);

  if (parsed === null || parsed === undefined) {
    return {};
  }

  const interpolated = interpolateDeep(parsed);

  return ConfigSchema.parse(interpolated);
}
