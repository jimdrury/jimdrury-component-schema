import type { AnyFieldType } from './field-type.interface';
import type { TabField, TabParams } from './tab.interface';
import { TabParamsSchema } from './tab.interface';

export const tab = <
  const N extends string,
  const Fields extends readonly AnyFieldType[],
>(
  params: TabParams<N, Fields>,
): TabField<N, Fields> => {
  TabParamsSchema.parse(params);
  return {
    _tab: true,
    _tabName: params.name as N,
    display_name: params.display_name,
    _fields: params.fields as Fields,
  };
};
