import type { FieldType } from './field-type.interface';
import {
  type Multiasset,
  type MultiassetParams,
  MultiassetParamsSchema,
} from './multiasset.interface';

export const multiasset = <const N extends string>(
  params: MultiassetParams<N>,
): FieldType<Multiasset<N>> => {
  const { name, ...props } = MultiassetParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'multiasset',
    ...props,
  };
};
