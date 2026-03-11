import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const TextareaParamsSchema = BaseFieldParamsSchema.extend({
  default_value: z.string().optional(),
  max_length: z.number().optional(),
});

export type TextareaParams<N extends string = string> = Omit<
  z.infer<typeof TextareaParamsSchema>,
  'name'
> & { name: N };

export type Textarea<N extends string = string> = BaseField<N> & {
  default_value?: string;
  max_length?: number;
};
