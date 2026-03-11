import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const DatetimeParamsSchema = BaseFieldParamsSchema.extend({
  disable_time: z.boolean().optional(),
  default_value: z.string().optional(),
});

export type DatetimeParams<N extends string = string> = Omit<
  z.infer<typeof DatetimeParamsSchema>,
  'name'
> & { name: N };

export type Datetime<N extends string = string> = BaseField<N> & {
  disable_time?: boolean;
  default_value?: string;
};
