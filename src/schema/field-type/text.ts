import type { FieldType } from './field-type.interface';
import { type Text, type TextParams, TextParamsSchema } from './text.interface';

export const text = <const N extends string>(params: TextParams<N>): FieldType<Text<N>> => {
  const { name, ...props } = TextParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'text',
    ...props,
  };
};
