import type { FieldType } from './field-type.interface';
import { type Multilink, type MultilinkParams, MultilinkParamsSchema } from './multilink.interface';

export const multilink = <const N extends string>(
  params: MultilinkParams<N>,
): FieldType<Multilink<N>> => {
  const { name, allowed_content_types, ...props } = MultilinkParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'multilink',
    ...props,
    ...(allowed_content_types && {
      restrict_content_types: true,
      component_whitelist: allowed_content_types.map((c) => c.name),
    }),
  };
};
