import type z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const TableParamsSchema = BaseFieldParamsSchema.extend({});

export type TableParams<N extends string = string> = Omit<
  z.infer<typeof TableParamsSchema>,
  'name'
> & {
  name: N;
};

export type Table<N extends string = string> = BaseField<N>;
