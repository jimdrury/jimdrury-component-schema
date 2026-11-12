import type { SchemaEntry } from '../field-type/field-type.interface';
import { buildSchema } from './_build-schema';
import {
  type NestableParams,
  NestableParamsSchema,
} from './nestable.interface';

export const nestable = <const Schema extends readonly SchemaEntry[]>(
  params: NestableParams<Schema>,
) => {
  const validatedParams = NestableParamsSchema.parse(params);
  const schema = buildSchema(validatedParams.schema as SchemaEntry[]);

  return {
    name: validatedParams.name,
    display_name: validatedParams.display_name,
    description: validatedParams.description,
    image: validatedParams.image,
    preview_field: validatedParams.preview_field,
    preview_tmpl: validatedParams.preview_tmpl,
    icon: validatedParams.icon,
    color: validatedParams.color,
    folder: validatedParams.folder,
    tags: validatedParams.tags,
    schema,
    is_root: false,
    is_nestable: true,
  };
};
