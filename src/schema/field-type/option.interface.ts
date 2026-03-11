import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const OptionItemSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const OptionParamsSchema = BaseFieldParamsSchema.extend({
  options: z.array(OptionItemSchema),
  default_value: z.string().optional(),
  use_uuid: z.boolean().optional(),
  source: z.enum(['internal', 'external', 'internal_stories', 'internal_languages', '']).optional(),
  datasource_slug: z.string().optional(),
  external_datasource: z.string().optional(),
  filter_content_type: z.array(z.string()).optional(),
  folder_slug: z.string().optional(),
});

export type OptionItem = z.infer<typeof OptionItemSchema>;

export type OptionParams<N extends string = string> = Omit<
  z.infer<typeof OptionParamsSchema>,
  'name'
> & { name: N };

export type Option<N extends string = string> = BaseField<N> & {
  options: OptionItem[];
  default_value?: string;
  use_uuid?: boolean;
  source?: 'internal' | 'external' | 'internal_stories' | 'internal_languages' | '';
  datasource_slug?: string;
  external_datasource?: string;
  filter_content_type?: string[];
  folder_slug?: string;
};
