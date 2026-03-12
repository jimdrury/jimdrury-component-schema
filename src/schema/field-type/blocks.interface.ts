import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export type ComponentRef = {
  name: string;
};

const componentRefSchema = z
  .array(
    z
      .object({
        name: z.string(),
      })
      .passthrough(),
  )
  .optional();
const stringArraySchema = z.array(z.string()).optional();

export const BlocksParamsSchema = BaseFieldParamsSchema.extend({
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  allowed_components: componentRefSchema,
  allowed_folders: stringArraySchema,
  allowed_tags: stringArraySchema,
  disallowed_components: componentRefSchema,
  disallowed_folders: stringArraySchema,
  disallowed_tags: stringArraySchema,
}).refine(
  (data) => {
    const provided = [
      data.allowed_components,
      data.allowed_folders,
      data.allowed_tags,
      data.disallowed_components,
      data.disallowed_folders,
      data.disallowed_tags,
    ].filter(Boolean);
    return provided.length <= 1;
  },
  {
    message:
      'Only one of allowed_components, allowed_folders, allowed_tags, disallowed_components, disallowed_folders, or disallowed_tags may be provided',
  },
);

type RestrictionKeys =
  | 'allowed_components'
  | 'allowed_folders'
  | 'allowed_tags'
  | 'disallowed_components'
  | 'disallowed_folders'
  | 'disallowed_tags';

type RestrictionTypes = {
  allowed_components: ComponentRef[];
  allowed_folders: string[];
  allowed_tags: string[];
  disallowed_components: ComponentRef[];
  disallowed_folders: string[];
  disallowed_tags: string[];
};

type ExclusiveRestriction<K extends RestrictionKeys> = {
  [P in K]: RestrictionTypes[P];
} & {
  [P in Exclude<RestrictionKeys, K>]?: never;
};

type NoRestrictions = { [K in RestrictionKeys]?: never };

type BlocksBaseParams<N extends string = string> = Omit<
  z.infer<typeof BlocksParamsSchema>,
  'name' | RestrictionKeys
> & {
  name: N;
};

export type BlocksParams<N extends string = string> = BlocksBaseParams<N> &
  (
    | ExclusiveRestriction<'allowed_components'>
    | ExclusiveRestriction<'allowed_folders'>
    | ExclusiveRestriction<'allowed_tags'>
    | ExclusiveRestriction<'disallowed_components'>
    | ExclusiveRestriction<'disallowed_folders'>
    | ExclusiveRestriction<'disallowed_tags'>
    | NoRestrictions
  );

export type Blocks<N extends string = string> = BaseField<N> & {
  minimum?: number;
  maximum?: number;
  restrict_type?: string;
  restrict_components?: boolean;
  component_whitelist?: string[];
  component_denylist?: string[];
  _allowed_folders?: string[];
  _allowed_tags?: string[];
  _disallowed_folders?: string[];
  _disallowed_tags?: string[];
};
