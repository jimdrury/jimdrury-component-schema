import type { FieldType } from './field-type.interface';
import {
  type Richtext,
  type RichtextParams,
  RichtextParamsSchema,
} from './richtext.interface';

export const richtext = <const N extends string>(
  params: RichtextParams<N>,
): FieldType<Richtext<N>> => {
  const { name, ...props } = RichtextParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'richtext',
    ...props,
  };
};
