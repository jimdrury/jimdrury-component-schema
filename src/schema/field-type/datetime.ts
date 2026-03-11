import { type Datetime, type DatetimeParams, DatetimeParamsSchema } from './datetime.interface';
import type { FieldType } from './field-type.interface';

export const datetime = <const N extends string>(
  params: DatetimeParams<N>,
): FieldType<Datetime<N>> => {
  const { name, ...props } = DatetimeParamsSchema.parse(params);
  return {
    _name: name as N,
    type: 'datetime',
    ...props,
  };
};
