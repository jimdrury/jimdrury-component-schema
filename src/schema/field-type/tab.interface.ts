import z from 'zod';
import { FieldTypeSchema, NameSchema } from './base.interface';
import type { AnyFieldType } from './field-type.interface';

export const TabParamsSchema = z.object({
  name: NameSchema,
  display_name: z.string(),
  fields: z.array(FieldTypeSchema).min(1, 'A tab must contain at least one field'),
});

export type TabParams<
  N extends string = string,
  Fields extends readonly AnyFieldType[] = AnyFieldType[],
> = {
  name: N;
  display_name: string;
  fields: Fields;
};

export type TabField<
  N extends string = string,
  Fields extends readonly AnyFieldType[] = AnyFieldType[],
> = {
  _tab: true;
  _tabName: N;
  display_name: string;
  _fields: Fields;
};
