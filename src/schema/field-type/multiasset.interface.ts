import z from 'zod';
import { type AssetFiletype, AssetFiletypeSchema } from './asset.interface';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const MultiassetParamsSchema = BaseFieldParamsSchema.extend({
  filetypes: z.array(AssetFiletypeSchema).optional(),
  allow_external_url: z.boolean().optional(),
});

export type MultiassetParams<N extends string = string> = Omit<
  z.infer<typeof MultiassetParamsSchema>,
  'name'
> & {
  name: N;
};

export type Multiasset<N extends string = string> = BaseField<N> & {
  filetypes?: AssetFiletype[];
  allow_external_url?: boolean;
};
