import type { FieldType } from './field-type.interface';
import {
  type PluginCodeBlock,
  type PluginCodeBlockParams,
  PluginCodeBlockParamsSchema,
} from './plugin-code-block.interface';

export const pluginCodeBlock = <const N extends string>(
  params: PluginCodeBlockParams<N>,
): FieldType<PluginCodeBlock<N>> => {
  const {
    name,
    enable_title,
    enable_line_number_start,
    languages,
    highlight_states,
    ...props
  } = PluginCodeBlockParamsSchema.parse(params);

  return {
    _name: name as N,
    type: 'custom',
    field_type: 'storyblok-code-block',
    ...props,
    options: [
      {
        name: 'enableTitle',
        value: enable_title ? 'true' : '',
      },
      {
        name: 'enableLineNumberStart',
        value: enable_line_number_start ? 'true' : '',
      },
      {
        name: 'languages',
        value: languages ? JSON.stringify(languages) : '[]',
      },
      {
        name: 'highlightStates',
        value: highlight_states ? JSON.stringify(highlight_states) : '',
      },
    ],
  };
};
