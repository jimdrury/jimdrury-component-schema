import type { SchemaEntry } from '../field-type/field-type.interface';
import { buildSchema } from './_build-schema';
import {
  type ContentTypeParams,
  ContentTypeParamsSchema,
} from './content-type.interface';

export const contentType = <const Schema extends readonly SchemaEntry[]>(
  params: ContentTypeParams<Schema>,
) => {
  const validatedParams = ContentTypeParamsSchema.parse(params);
  const schema = buildSchema(validatedParams.schema as SchemaEntry[]);

  return {
    name: validatedParams.name,
    display_name: validatedParams.display_name,
    image: validatedParams.image,
    preview_field: validatedParams.preview_field,
    folder: validatedParams.folder,
    tags: validatedParams.tags,
    schema,
    is_root: true,
  };
};
