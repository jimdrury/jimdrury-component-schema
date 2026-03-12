import { describe, expect, it } from 'vitest';
import { tab } from './tab';
import { text } from './text';

describe('tab', () => {
  it('creates a tab with required params', () => {
    const result = tab({
      name: 'config',
      display_name: 'Config',
      fields: [
        text({
          name: 'title',
        }),
      ],
    });

    expect(result).toEqual({
      _tab: true,
      _tabName: 'config',
      display_name: 'Config',
      _fields: [
        {
          _name: 'title',
          type: 'text',
        },
      ],
    });
  });

  it('rejects invalid names', () => {
    expect(() =>
      tab({
        name: 'My Tab' as never,
        display_name: 'My Tab',
        fields: [
          text({
            name: 'title',
          }),
        ],
      }),
    ).toThrow();
  });

  it('rejects empty fields array', () => {
    expect(() =>
      tab({
        name: 'config',
        display_name: 'Config',
        fields: [] as never,
      }),
    ).toThrow();
  });

  it('rejects invalid fields', () => {
    expect(() =>
      tab({
        name: 'config',
        display_name: 'Config',
        fields: [
          {
            invalid: true,
          },
        ] as never,
      }),
    ).toThrow();
  });

  it('preserves multiple fields', () => {
    const result = tab({
      name: 'seo',
      display_name: 'SEO',
      fields: [
        text({
          name: 'meta_title',
        }),
        text({
          name: 'meta_description',
        }),
      ],
    });

    expect(result._fields).toHaveLength(2);
    expect(result._fields[0]._name).toBe('meta_title');
    expect(result._fields[1]._name).toBe('meta_description');
  });
});
