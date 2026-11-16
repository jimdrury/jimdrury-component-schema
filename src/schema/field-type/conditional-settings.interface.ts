import z from 'zod';
import { NameSchema } from './name.interface';

const ValidatedObjectSchema = z.strictObject({
  type: z.literal('field'),
  field_key: NameSchema,
  field_attr: z.literal('value'),
});

const ComparedValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.record(z.string(), z.unknown()),
]);

const EqualityConditionSchema = z.strictObject({
  validated_object: ValidatedObjectSchema,
  validation: z.enum([
    'equals',
    'not_equals',
  ]),
  value: ComparedValueSchema,
});

const PresenceConditionSchema = z.strictObject({
  validated_object: ValidatedObjectSchema,
  validation: z.enum([
    'empty',
    'not_empty',
  ]),
  value: z.null().optional(),
});

const ComparisonConditionSchema = z.strictObject({
  validated_object: ValidatedObjectSchema,
  validation: z.enum([
    'gt',
    'lt',
  ]),
  value: z.union([
    z.number(),
    z.string(),
  ]),
});

export const RuleConditionSchema = z.union([
  EqualityConditionSchema,
  PresenceConditionSchema,
  ComparisonConditionSchema,
]);

export const ModificationSchema = z.union([
  z.strictObject({
    display: z.enum([
      'hide',
      'hidden',
    ]),
    required: z.never().optional(),
  }),
  z.strictObject({
    display: z.never().optional(),
    required: z.boolean(),
  }),
]);

export const ConditionalSettingSchema = z.strictObject({
  rule_match: z.enum([
    'all',
    'any',
  ]),
  rule_conditions: z
    .array(RuleConditionSchema)
    .min(1, 'A conditional setting needs at least one rule condition'),
  modifications: z
    .array(ModificationSchema)
    .min(1, 'A conditional setting needs at least one modification'),
});

export const ConditionalSettingsSchema = z
  .array(ConditionalSettingSchema)
  .min(1, 'conditional_settings must contain at least one setting');

export type RuleCondition = z.infer<typeof RuleConditionSchema>;

export type Modification = z.infer<typeof ModificationSchema>;

export type ConditionalSetting = z.infer<typeof ConditionalSettingSchema>;
