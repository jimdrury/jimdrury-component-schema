import {
  type Blocks,
  type BlocksParams,
  BlocksParamsSchema,
} from './blocks.interface';
import type { FieldType } from './field-type.interface';

export const blocks = <const N extends string>(
  params: BlocksParams<N>,
): FieldType<Blocks<N>> => {
  const {
    name,
    allowed_components,
    allowed_folders,
    allowed_tags,
    disallowed_components,
    disallowed_folders,
    disallowed_tags,
    ...props
  } = BlocksParamsSchema.parse(params);

  return {
    _name: name as N,
    type: 'bloks',
    ...props,
    ...(allowed_components && {
      restrict_type: '',
      restrict_components: true,
      component_whitelist: allowed_components.map((c) => c.name),
      component_denylist: [],
    }),
    ...(disallowed_components && {
      restrict_type: '',
      restrict_components: true,
      component_whitelist: [],
      component_denylist: disallowed_components.map((c) => c.name),
    }),
    ...(allowed_folders && {
      _allowed_folders: allowed_folders,
    }),
    ...(disallowed_folders && {
      _disallowed_folders: disallowed_folders,
    }),
    ...(allowed_tags && {
      _allowed_tags: allowed_tags,
    }),
    ...(disallowed_tags && {
      _disallowed_tags: disallowed_tags,
    }),
  };
};
