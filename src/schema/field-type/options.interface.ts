import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';
import { type OptionItem, OptionItemSchema } from './option.interface';

export const OptionsParamsSchema = BaseFieldParamsSchema.extend({
  options: z.array(OptionItemSchema),
  default_value: z.array(z.string()).optional(),
  min_options: z.number().optional(),
  max_options: z.number().optional(),
  use_uuid: z.boolean().optional(),
  source: z.enum(['internal', 'external', 'internal_stories', 'internal_languages', '']).optional(),
  datasource_slug: z.string().optional(),
  external_datasource: z.string().optional(),
  filter_content_type: z.array(z.string()).optional(),
  folder_slug: z.string().optional(),
});

export type OptionsParams<N extends string = string> = Omit<
  z.infer<typeof OptionsParamsSchema>,
  'name'
> & { name: N };

export type Options<N extends string = string> = BaseField<N> & {
  options: OptionItem[];
  default_value?: string[];
  min_options?: number;
  max_options?: number;
  use_uuid?: boolean;
  source?: 'internal' | 'external' | 'internal_stories' | 'internal_languages' | '';
  datasource_slug?: string;
  external_datasource?: string;
  filter_content_type?: string[];
  folder_slug?: string;
};
