import type { FieldType } from './field-type.interface';
import { type Textarea, type TextareaParams, TextareaParamsSchema } from './textarea.interface';

export const textarea = <const N extends string>(
  params: TextareaParams<N>,
): FieldType<Textarea<N>> => {
  const { name, ...props } = TextareaParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'textarea',
    ...props,
  };
};
