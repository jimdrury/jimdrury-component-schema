import type { FieldType } from './field-type.interface';
import {
  type Options,
  type OptionsParams,
  OptionsParamsSchema,
} from './options.interface';

export const options = <const N extends string>(
  params: OptionsParams<N>,
): FieldType<Options<N>> => {
  const { name, ...props } = OptionsParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'options',
    ...props,
  };
};
