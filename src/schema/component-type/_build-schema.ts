import type { BaseField } from '../field-type/base.interface';
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

  assertConditionalFields(schema);

  return schema;
}

function assertConditionalFields(schema: Record<string, unknown>): void {
  for (const [fieldName, value] of Object.entries(schema)) {
    const settings = (value as Partial<BaseField>).conditional_settings;
    for (const setting of settings ?? []) {
      for (const condition of setting.rule_conditions) {
        const { field_key } = condition.validated_object;
        const target = schema[field_key] as
          | {
              type?: unknown;
            }
          | undefined;
        if (field_key === fieldName) {
          throw new Error(
            `Field "${fieldName}" has a conditional setting that depends on itself`,
          );
        }
        if (target === undefined || target.type === 'tab') {
          throw new Error(
            `Field "${fieldName}" has a conditional setting on unknown field "${field_key}"`,
          );
        }
      }
    }
  }
}

export function assertAssetField(
  schema: Record<string, unknown>,
  fieldName: string | undefined,
  label: string,
): void {
  if (fieldName === undefined) {
    return;
  }
  const field = schema[fieldName] as
    | {
        type?: unknown;
      }
    | undefined;
  if (field?.type !== 'asset') {
    throw new Error(`${label} "${fieldName}" must name an asset field`);
  }
}
