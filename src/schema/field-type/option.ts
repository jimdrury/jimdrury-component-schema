import type { FieldType } from './field-type.interface';
import {
  type Option,
  type OptionParams,
  OptionParamsSchema,
} from './option.interface';

export const option = <const N extends string>(
  params: OptionParams<N>,
): FieldType<Option<N>> => {
  const { name, ...props } = OptionParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'option',
    ...props,
  };
};
