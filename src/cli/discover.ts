import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { register } from 'tsx/esm/api';
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

export async function discoverComponents(
  componentsDir: string,
): Promise<ComponentDefinition[]> {
  const files = collectTsFiles(componentsDir);
  const components: ComponentDefinition[] = [];

  const unregister = register();

  try {
    for (const file of files) {
      const fileUrl = pathToFileURL(file).href;
      const mod = await import(fileUrl);
      components.push(mod.default);
    }
  } finally {
    unregister();
  }

  return components;
}
