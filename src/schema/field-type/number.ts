import type { FieldType } from './field-type.interface';
import { type NumberField, type NumberParams, NumberParamsSchema } from './number.interface';

export const number = <const N extends string>(
  params: NumberParams<N>,
): FieldType<NumberField<N>> => {
  const { name, ...props } = NumberParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'number',
    ...props,
  };
};
