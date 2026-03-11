import { type BooleanField, type BooleanParams, BooleanParamsSchema } from './boolean.interface';
import type { FieldType } from './field-type.interface';

export const boolean = <const N extends string>(
  params: BooleanParams<N>,
): FieldType<BooleanField<N>> => {
  const { name, ...props } = BooleanParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'boolean',
    ...props,
  };
};
