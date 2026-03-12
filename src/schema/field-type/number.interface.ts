import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const NumberParamsSchema = BaseFieldParamsSchema.extend({
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  decimals: z.number().optional(),
  steps: z.number().optional(),
  default_value: z.number().optional(),
});

export type NumberParams<N extends string = string> = Omit<
  z.infer<typeof NumberParamsSchema>,
  'name'
> & {
  name: N;
};

export type NumberField<N extends string = string> = BaseField<N> & {
  min_value?: number;
  max_value?: number;
  decimals?: number;
  steps?: number;
  default_value?: number;
};
