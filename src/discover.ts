import fs from 'node:fs';
import path from 'node:path';

export type ComponentDefinition = {
  name: string;
  display_name?: string;
  schema: Record<string, unknown>;
  is_root?: boolean;
  is_nestable?: boolean;
  image?: string;
  preview_field?: string;
  folder?: string;
  tags?: string[];
};

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
    const mod = await import(file);
    components.push(mod.default);
  }

  return components;
}
