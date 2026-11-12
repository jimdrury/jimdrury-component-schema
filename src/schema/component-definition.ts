export type ComponentDefinition = {
  name: string;
  display_name?: string;
  schema: Record<string, unknown>;
  is_root?: boolean;
  is_nestable?: boolean;
  image?: string;
  preview_field?: string;
  preview_tmpl?: string;
  icon?: string;
  color?: string;
  content_type_asset_preview?: string;
  folder?: string;
  tags?: string[];
};
