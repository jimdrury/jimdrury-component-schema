import { describe, expect, it } from 'vitest';
import { pluginCodeBlock } from './plugin-code-block';

describe('pluginCodeBlock', () => {
  it('creates a code block field with minimal params', () => {
    const result = pluginCodeBlock({
      name: 'contents',
    });
    expect(result).toEqual({
      _name: 'contents',
      type: 'custom',
      field_type: 'storyblok-code-block',
      options: [
        {
          name: 'enableTitle',
          value: '',
        },
        {
          name: 'enableLineNumberStart',
          value: '',
        },
        {
          name: 'languages',
          value: '[]',
        },
        {
          name: 'highlightStates',
          value: '',
        },
      ],
    });
  });

  it('enables title and line number start', () => {
    const result = pluginCodeBlock({
      name: 'snippet',
      enable_title: true,
      enable_line_number_start: true,
    });
    expect(result).toEqual({
      _name: 'snippet',
      type: 'custom',
      field_type: 'storyblok-code-block',
      options: [
        {
          name: 'enableTitle',
          value: 'true',
        },
        {
          name: 'enableLineNumberStart',
          value: 'true',
        },
        {
          name: 'languages',
          value: '[]',
        },
        {
          name: 'highlightStates',
          value: '',
        },
      ],
    });
  });

  it('serialises languages array to JSON', () => {
    const result = pluginCodeBlock({
      name: 'code',
      languages: [
        'tsx',
        'jsx',
        'json',
      ],
    });
    const langOption = result.options.find((o) => o.name === 'languages');
    expect(langOption?.value).toBe('["tsx","jsx","json"]');
  });

  it('serialises highlight_states to JSON', () => {
    const states = [
      {
        value: '',
        color: 'transparent',
      },
      {
        value: 'attention',
        color: '#fbce41',
      },
    ];
    const result = pluginCodeBlock({
      name: 'code',
      highlight_states: states,
    });
    const hsOption = result.options.find((o) => o.name === 'highlightStates');
    expect(hsOption?.value).toBe(JSON.stringify(states));
  });

  it('rejects highlight_states with fewer than 2 entries', () => {
    expect(() =>
      pluginCodeBlock({
        name: 'code',
        highlight_states: [
          {
            value: '',
            color: 'transparent',
          },
        ],
      }),
    ).toThrow();
  });

  it('includes all options together', () => {
    const states = [
      {
        value: '',
        color: 'transparent',
      },
      {
        value: 'add',
        color: '#2db47d',
      },
      {
        value: 'remove',
        color: '#ff6159',
      },
    ];
    const result = pluginCodeBlock({
      name: 'code',
      enable_title: true,
      enable_line_number_start: true,
      languages: [
        'js',
        'css',
      ],
      highlight_states: states,
      required: true,
    });
    expect(result).toEqual({
      _name: 'code',
      type: 'custom',
      field_type: 'storyblok-code-block',
      required: true,
      options: [
        {
          name: 'enableTitle',
          value: 'true',
        },
        {
          name: 'enableLineNumberStart',
          value: 'true',
        },
        {
          name: 'languages',
          value: '["js","css"]',
        },
        {
          name: 'highlightStates',
          value: JSON.stringify(states),
        },
      ],
    });
  });

  it('passes through base field params', () => {
    const result = pluginCodeBlock({
      name: 'code',
      description: 'A code snippet',
      tooltip: true,
      required: true,
    });
    expect(result.description).toBe('A code snippet');
    expect(result.tooltip).toBe(true);
    expect(result.required).toBe(true);
  });

  it('rejects invalid names', () => {
    expect(() =>
      pluginCodeBlock({
        name: 'CodeBlock' as never,
      }),
    ).toThrow();
  });
});
