import type { ComponentDefinition } from './discover';

function resolveFolderUuids(
  paths: string[],
  folderPathToUuid: Map<string, string>,
  label: string,
): string[] {
  return paths.map((p) => {
    const uuid = folderPathToUuid.get(p);
    if (!uuid) {
      throw new Error(`Unknown folder path "${p}" in ${label}`);
    }
    return uuid;
  });
}

function resolveTagIds(
  names: string[],
  tagNameToId: Map<string, number>,
  label: string,
): number[] {
  return names.map((name) => {
    const id = tagNameToId.get(name);
    if (!id) {
      throw new Error(`Unknown tag "${name}" in ${label}`);
    }
    return id;
  });
}

export function resolveSchemaRestrictions(
  schema: Record<string, unknown>,
  folderPathToUuid: Map<string, string>,
  tagNameToId: Map<string, number>,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    const field = value as Record<string, unknown>;

    if (field._allowed_folders || field._disallowed_folders) {
      const isAllow = Boolean(field._allowed_folders);
      const paths = (field._allowed_folders ??
        field._disallowed_folders) as string[];
      const { _allowed_folders, _disallowed_folders, ...rest } = field;
      const uuids = resolveFolderUuids(
        paths,
        folderPathToUuid,
        isAllow ? 'allowed_folders' : 'disallowed_folders',
      );
      resolved[key] = {
        ...rest,
        restrict_type: 'groups',
        restrict_components: true,
        component_whitelist: [],
        component_denylist: [],
        component_group_whitelist: isAllow ? uuids : [],
        component_group_denylist: isAllow ? [] : uuids,
        component_tag_whitelist: [],
        component_tag_denylist: [],
      };
    } else if (field._allowed_tags || field._disallowed_tags) {
      const isAllow = Boolean(field._allowed_tags);
      const names = (field._allowed_tags ?? field._disallowed_tags) as string[];
      const { _allowed_tags, _disallowed_tags, ...rest } = field;
      const ids = resolveTagIds(
        names,
        tagNameToId,
        isAllow ? 'allowed_tags' : 'disallowed_tags',
      );
      resolved[key] = {
        ...rest,
        restrict_type: 'tags',
        restrict_components: true,
        component_whitelist: [],
        component_denylist: [],
        component_group_whitelist: [],
        component_group_denylist: [],
        component_tag_whitelist: isAllow ? ids : [],
        component_tag_denylist: isAllow ? [] : ids,
      };
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

export function buildComponentPayload(
  component: ComponentDefinition,
  folderPathToUuid: Map<string, string>,
  tagNameToId: Map<string, number>,
) {
  const { folder, tags, ...componentData } = component;
  const component_group_uuid = folder
    ? folderPathToUuid.get(folder)
    : undefined;
  const schema = resolveSchemaRestrictions(
    componentData.schema,
    folderPathToUuid,
    tagNameToId,
  );
  const internal_tag_ids = tags?.map((name) => {
    const id = tagNameToId.get(name);
    if (!id) {
      throw new Error(`Unknown tag "${name}" on component "${component.name}"`);
    }
    return id;
  });

  return {
    ...componentData,
    schema,
    ...(component_group_uuid !== undefined && {
      component_group_uuid,
    }),
    ...(internal_tag_ids !== undefined && {
      internal_tag_ids,
    }),
  };
}
