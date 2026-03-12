import type {
  AnyFieldType,
  SchemaEntry,
} from '../field-type/field-type.interface';

function isTabEntry(entry: SchemaEntry): entry is {
  _tab: true;
  _tabName: string;
  display_name: string;
  _fields: AnyFieldType[];
} {
  return '_tab' in entry && entry._tab === true;
}

export function buildSchema(entries: SchemaEntry[]): Record<string, unknown> {
  const schema: Record<string, unknown> = {};

  for (const entry of entries) {
    if (isTabEntry(entry)) {
      const fieldNames: string[] = [];

      for (const field of entry._fields) {
        const { _name, ...props } = field;
        schema[_name] = props;
        fieldNames.push(_name);
      }

      schema[`tab_${entry._tabName}`] = {
        type: 'tab',
        display_name: entry.display_name,
        keys: fieldNames,
      };
    } else {
      const { _name, ...props } = entry;
      schema[_name] = props;
    }
  }

  return schema;
}
