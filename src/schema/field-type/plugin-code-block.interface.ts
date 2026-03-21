import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const HighlightStateSchema = z.object({
  value: z.string(),
  color: z.string(),
});

export const PluginCodeBlockParamsSchema = BaseFieldParamsSchema.extend({
  enable_title: z.boolean().optional(),
  enable_line_number_start: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  highlight_states: z.array(HighlightStateSchema).min(2).optional(),
});

export type HighlightState = z.infer<typeof HighlightStateSchema>;

export type PluginCodeBlockParams<N extends string = string> = Omit<
  z.infer<typeof PluginCodeBlockParamsSchema>,
  'name'
> & {
  name: N;
};

type PluginOption = {
  name: string;
  value: string;
};

export type PluginCodeBlock<N extends string = string> = BaseField<N> & {
  field_type: 'storyblok-code-block';
  options: PluginOption[];
};
