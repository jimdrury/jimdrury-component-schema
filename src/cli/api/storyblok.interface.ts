import { z } from 'zod';

export const GetComponentsSchema = z.object({
  by_ids: z.array(z.string()).optional(),
  sort_by: z.string().optional(),
  is_root: z.boolean().optional(),
  search: z.string().optional(),
  in_group: z.uuid().optional(),
});

export type GetComponentsParams = z.infer<typeof GetComponentsSchema>;

export const ComponentSchemaFieldSchema = z.record(z.string(), z.any());

export const CreateComponentSchema = z.object({
  name: z.string(),
  display_name: z.string().nullable().optional(),
  schema: ComponentSchemaFieldSchema.optional(),
  image: z.string().nullable().optional(),
  preview_field: z.string().optional(),
  is_root: z.boolean().optional(),
  preview_tmpl: z.string().optional(),
  is_nestable: z.boolean().optional(),
  component_group_uuid: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  internal_tag_ids: z.array(z.number()).optional(),
  content_type_asset_preview: z.string().optional(),
});

export type CreateComponentParams = z.infer<typeof CreateComponentSchema>;

export const UpdateComponentSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  display_name: z.string().nullable().optional(),
  schema: ComponentSchemaFieldSchema.optional(),
  image: z.string().nullable().optional(),
  preview_field: z.string().optional(),
  is_root: z.boolean().optional(),
  preview_tmpl: z.string().optional(),
  is_nestable: z.boolean().optional(),
  component_group_uuid: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  internal_tag_ids: z.array(z.number()).optional(),
  content_type_asset_preview: z.string().optional(),
});

export type UpdateComponentParams = z.infer<typeof UpdateComponentSchema>;

// Component Folders (component_groups)

export const GetComponentFoldersSchema = z.object({
  search: z.string().optional(),
  with_parent: z.string().optional(),
});

export type GetComponentFoldersParams = z.infer<
  typeof GetComponentFoldersSchema
>;

export const CreateComponentFolderSchema = z.object({
  name: z.string(),
  parent_id: z.number().optional(),
});

export type CreateComponentFolderParams = z.infer<
  typeof CreateComponentFolderSchema
>;

export const UpdateComponentFolderSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  parent_id: z.number().optional(),
});

export type UpdateComponentFolderParams = z.infer<
  typeof UpdateComponentFolderSchema
>;

// Internal Tags

export const GetInternalTagsSchema = z.object({
  by_object_type: z.string().optional(),
});

export type GetInternalTagsParams = z.infer<typeof GetInternalTagsSchema>;

export const CreateInternalTagSchema = z.object({
  name: z.string(),
  object_type: z.literal('component'),
});

export type CreateInternalTagParams = z.infer<typeof CreateInternalTagSchema>;
