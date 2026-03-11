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

export async function discoverComponents(componentsDir: string): Promise<ComponentDefinition[]> {
  const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.ts'));
  const components: ComponentDefinition[] = [];

  for (const file of files) {
    const modulePath = path.resolve(componentsDir, file);
    const mod = await import(modulePath);
    components.push(mod.default);
  }

  return components;
}
