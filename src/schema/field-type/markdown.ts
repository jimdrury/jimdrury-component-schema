import type { FieldType } from './field-type.interface';
import { type Markdown, type MarkdownParams, MarkdownParamsSchema } from './markdown.interface';

export const markdown = <const N extends string>(
  params: MarkdownParams<N>,
): FieldType<Markdown<N>> => {
  const { name, ...props } = MarkdownParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'markdown',
    ...props,
  };
};
