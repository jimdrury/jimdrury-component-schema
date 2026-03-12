import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const AssetFiletypeSchema = z.enum([
  'images',
  'videos',
  'audios',
  'texts',
]);

export type AssetFiletype = z.infer<typeof AssetFiletypeSchema>;

export const AssetParamsSchema = BaseFieldParamsSchema.extend({
  filetypes: z.array(AssetFiletypeSchema).optional(),
  allow_external_url: z.boolean().optional(),
});

export type AssetParams<N extends string = string> = Omit<
  z.infer<typeof AssetParamsSchema>,
  'name'
> & {
  name: N;
};

export type Asset<N extends string = string> = BaseField<N> & {
  filetypes?: AssetFiletype[];
  allow_external_url?: boolean;
};
