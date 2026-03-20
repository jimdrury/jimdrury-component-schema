import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { tsImport } from 'tsx/esm/api';
import type { ComponentDefinition } from '../schema/component-definition';

function collectTsFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractDefault(mod: Record<string, unknown>): ComponentDefinition {
  let value = mod.default;
  if (
    value &&
    typeof value === 'object' &&
    '__esModule' in value &&
    'default' in value
  ) {
    value = (value as Record<string, unknown>).default;
  }
  return value as ComponentDefinition;
}

export async function discoverComponents(
  componentsDir: string,
): Promise<ComponentDefinition[]> {
  const files = collectTsFiles(componentsDir);
  const components: ComponentDefinition[] = [];
  const parentURL = pathToFileURL(
    path.join(componentsDir, '_resolver.ts'),
  ).href;

  for (const file of files) {
    const mod = await tsImport(file, {
      parentURL,
      tsconfig: false,
    });
    components.push(extractDefault(mod as Record<string, unknown>));
  }

  return components;
}
