import z from 'zod';
import { NameSchema, SchemaEntrySchema } from '../field-type/base.interface';
import type { SchemaEntry } from '../field-type/field-type.interface';
import type { AssertNoDuplicateNames } from './_common.interface';

export const ContentTypeParamsSchema = z.object({
  name: NameSchema,
  display_name: z.string(),
  image: z.url().optional(),
  preview_field: z.string().optional(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
  schema: z.array(SchemaEntrySchema),
});

export type ContentTypeParams<
  Schema extends readonly SchemaEntry[] = SchemaEntry[],
> = {
  name: string;
  display_name: string;
  image?: string;
  preview_field?: string;
  folder?: string;
  tags?: string[];
  schema: AssertNoDuplicateNames<Schema>;
};
