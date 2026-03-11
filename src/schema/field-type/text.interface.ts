import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const TextParamsSchema = BaseFieldParamsSchema.extend({
  translatable: z.boolean().optional(),
  default_value: z.string().optional(),
  max_length: z.number().optional(),
  regex: z.string().optional(),
});

export type TextParams<N extends string = string> = Omit<
  z.infer<typeof TextParamsSchema>,
  'name'
> & { name: N };

export type Text<N extends string = string> = BaseField<N> & {
  translatable?: boolean;
  default_value?: string;
  max_length?: number;
  regex?: string;
};
