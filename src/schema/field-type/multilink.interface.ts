import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

const componentRefSchema = z.array(
  z
    .object({
      name: z.string(),
    })
    .passthrough(),
);

export const MultilinkParamsSchema = BaseFieldParamsSchema.extend({
  email_link_type: z.boolean().optional(),
  asset_link_type: z.boolean().optional(),
  show_anchor: z.boolean().optional(),
  allow_target_blank: z.boolean().optional(),
  allow_custom_attributes: z.boolean().optional(),
  force_link_scope: z.boolean().optional(),
  allowed_content_types: componentRefSchema.optional(),
});

export type MultilinkParams<N extends string = string> = Omit<
  z.infer<typeof MultilinkParamsSchema>,
  'name'
> & {
  name: N;
};

export type Multilink<N extends string = string> = BaseField<N> & {
  email_link_type?: boolean;
  asset_link_type?: boolean;
  show_anchor?: boolean;
  allow_target_blank?: boolean;
  allow_custom_attributes?: boolean;
  force_link_scope?: boolean;
  restrict_content_types?: boolean;
  component_whitelist?: string[];
};
