import type { FieldType } from './field-type.interface';
import {
  type Table,
  type TableParams,
  TableParamsSchema,
} from './table.interface';

export const table = <const N extends string>(
  params: TableParams<N>,
): FieldType<Table<N>> => {
  const { name, ...props } = TableParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'table',
    ...props,
  };
};
