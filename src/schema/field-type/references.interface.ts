import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

const componentRefSchema = z.array(z.object({ name: z.string() }).passthrough());

export const ReferencesParamsSchema = BaseFieldParamsSchema.extend({
  filter_content_type: componentRefSchema.optional(),
  folder_slug: z.string().optional(),
  entry_appearance: z.enum(['card', 'link']).optional(),
  allow_advanced_search: z.boolean().optional(),
});

export type ReferencesParams<N extends string = string> = Omit<
  z.infer<typeof ReferencesParamsSchema>,
  'name'
> & { name: N };

export type References<N extends string = string> = BaseField<N> & {
  is_reference_type: true;
  source: 'internal_stories';
  filter_content_type?: string[];
  folder_slug?: string;
  entry_appearance?: 'card' | 'link';
  allow_advanced_search?: boolean;
};
