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
