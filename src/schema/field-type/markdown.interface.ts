import z from 'zod';
import { type BaseField, BaseFieldParamsSchema } from './base.interface';

export const MarkdownParamsSchema = BaseFieldParamsSchema.extend({
  max_length: z.number().optional(),
  rich_markdown: z.boolean().optional(),
});

export type MarkdownParams<N extends string = string> = Omit<
  z.infer<typeof MarkdownParamsSchema>,
  'name'
> & { name: N };

export type Markdown<N extends string = string> = BaseField<N> & {
  max_length?: number;
  rich_markdown?: boolean;
};
