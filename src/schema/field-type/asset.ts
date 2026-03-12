import {
  type Asset,
  type AssetParams,
  AssetParamsSchema,
} from './asset.interface';
import type { FieldType } from './field-type.interface';

export const asset = <const N extends string>(
  params: AssetParams<N>,
): FieldType<Asset<N>> => {
  const { name, ...props } = AssetParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'asset',
    ...props,
  };
};
