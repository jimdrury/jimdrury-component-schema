import type { SchemaEntry } from '../field-type/field-type.interface';
import { assertAssetField, buildSchema } from './_build-schema';
import {
  type ContentTypeParams,
  ContentTypeParamsSchema,
} from './content-type.interface';

export const contentType = <const Schema extends readonly SchemaEntry[]>(
  params: ContentTypeParams<Schema>,
) => {
  const validatedParams = ContentTypeParamsSchema.parse(params);
  const schema = buildSchema(validatedParams.schema as SchemaEntry[]);
  assertAssetField(
    schema,
    validatedParams.content_type_asset_preview,
    'content_type_asset_preview',
  );

  return {
    name: validatedParams.name,
    display_name: validatedParams.display_name,
    description: validatedParams.description,
    image: validatedParams.image,
    preview_field: validatedParams.preview_field,
    preview_tmpl: validatedParams.preview_tmpl,
    icon: validatedParams.icon,
    color: validatedParams.color,
    content_type_asset_preview: validatedParams.content_type_asset_preview,
    folder: validatedParams.folder,
    tags: validatedParams.tags,
    schema,
    is_root: true,
    is_nestable: false,
  };
};
