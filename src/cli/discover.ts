import fs from 'node:fs';
import path from 'node:path';
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

export async function discoverComponents(
  componentsDir: string,
): Promise<ComponentDefinition[]> {
  const files = collectTsFiles(componentsDir);
  const components: ComponentDefinition[] = [];

  for (const file of files) {
    const mod = await tsImport(file, {
      parentURL: import.meta.url,
      tsconfig: false,
    });
    components.push(mod.default);
  }

  return components;
}
