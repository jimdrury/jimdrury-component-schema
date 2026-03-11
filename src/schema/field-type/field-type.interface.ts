import type { TabField } from './tab.interface';

export type FieldType<T extends { _name: string }> = { type: string } & T;

export type AnyFieldType = FieldType<{ _name: string }>;

export type AnyTabField = TabField<string, readonly AnyFieldType[]>;

export type SchemaEntry = AnyFieldType | AnyTabField;
