import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const BooleanParamsSchema = BaseFieldParamsSchema.extend({
  default_value: z.boolean().optional(),
  inline_label: z.boolean().optional(),
});

export type BooleanParams<N extends string = string> = Omit<
  z.infer<typeof BooleanParamsSchema>,
  'name'
> & {
  name: N;
};

export type BooleanField<N extends string = string> = BaseField<N> & {
  default_value?: boolean;
  inline_label?: boolean;
};
