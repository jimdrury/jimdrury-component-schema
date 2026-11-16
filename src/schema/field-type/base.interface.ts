import z from 'zod';
import {
  type ConditionalSetting,
  ConditionalSettingsSchema,
} from './conditional-settings.interface';
import { NameSchema } from './name.interface';

export { NameSchema };

export const BaseFieldParamsSchema = z.object({
  name: NameSchema,
  description: z.string().optional(),
  tooltip: z.boolean().optional(),
  required: z.boolean().optional(),
  conditional_settings: ConditionalSettingsSchema.optional(),
});

export const FieldTypeSchema = z
  .object({
    _name: NameSchema,
    type: z.string(),
  })
  .loose();

export const TabEntrySchema = z.object({
  _tab: z.literal(true),
  _tabName: NameSchema,
  display_name: z.string(),
  _fields: z.array(FieldTypeSchema).min(1),
});

export const SchemaEntrySchema = z.union([
  FieldTypeSchema,
  TabEntrySchema,
]);

export type BaseFieldParams<N extends string = string> = Omit<
  z.infer<typeof BaseFieldParamsSchema>,
  'name'
> & {
  name: N;
};

export type BaseField<N extends string = string> = {
  _name: N;
  description?: string;
  tooltip?: boolean;
  required?: boolean;
  conditional_settings?: ConditionalSetting[];
};
