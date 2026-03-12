import type {
  AnyFieldType,
  AnyTabField,
  SchemaEntry,
} from '../field-type/field-type.interface';

type ExtractNames<T extends readonly SchemaEntry[]> = T extends readonly [
  infer First,
  ...infer Rest extends SchemaEntry[],
]
  ? First extends AnyTabField
    ? [
        ...ExtractNames<First['_fields']>,
        ...ExtractNames<Rest>,
      ]
    : First extends AnyFieldType
      ? [
          First,
          ...ExtractNames<Rest>,
        ]
      : ExtractNames<Rest>
  : [];

type HasDuplicateNames<
  T extends readonly {
    _name: string;
  }[],
> = T extends readonly [
  infer First extends {
    _name: string;
  },
  ...infer Rest extends {
    _name: string;
  }[],
]
  ? First['_name'] extends Rest[number]['_name']
    ? true
    : HasDuplicateNames<Rest>
  : false;

export type AssertNoDuplicateNames<T extends readonly SchemaEntry[]> =
  HasDuplicateNames<ExtractNames<T>> extends true
    ? {
        error: 'Duplicate field names detected in schema';
        names: ExtractNames<T>[number]['_name'];
      }
    : T;
