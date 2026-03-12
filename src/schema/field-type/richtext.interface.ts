import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const RichtextParamsSchema = BaseFieldParamsSchema.extend({
  max_length: z.number().optional(),
  allow_target_blank: z.boolean().optional(),
});

export type RichtextParams<N extends string = string> = Omit<
  z.infer<typeof RichtextParamsSchema>,
  'name'
> & {
  name: N;
};

export type Richtext<N extends string = string> = BaseField<N> & {
  max_length?: number;
  allow_target_blank?: boolean;
};
