import type { FieldType } from './field-type.interface';
import {
  type References,
  type ReferencesParams,
  ReferencesParamsSchema,
} from './references.interface';

export const references = <const N extends string>(
  params: ReferencesParams<N>,
): FieldType<References<N>> => {
  const { name, filter_content_type, ...props } = ReferencesParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'options',
    is_reference_type: true,
    source: 'internal_stories',
    ...props,
    ...(filter_content_type && {
      filter_content_type: filter_content_type.map((c) => c.name),
    }),
  };
};
