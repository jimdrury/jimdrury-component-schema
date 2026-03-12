import type { StoryblokApi } from './api/storyblok';
import type { ComponentDefinition } from './discover';
import { buildComponentPayload } from './payload';

type RemoteComponent = {
  name: string;
  id: number;
  [key: string]: unknown;
};

type RemoteFolder = {
  id: number;
  name: string;
  uuid: string;
  parent_id: number | null;
};
type RemoteTag = {
  id: number;
  name: string;
  object_type: string;
};

export type FieldChange = {
  path: string;
  type: 'added' | 'removed' | 'changed';
  local?: unknown;
  remote?: unknown;
};

export type PlanAction = {
  action: 'create' | 'update' | 'delete';
  resourceType: 'component' | 'folder' | 'tag';
  name: string;
  remoteId?: number;
  changes?: FieldChange[];
};

export type RemoteState = {
  components: RemoteComponent[];
  folders: RemoteFolder[];
  tags: RemoteTag[];
  folderPathToUuid: Map<string, string>;
  folderPathToId: Map<string, number>;
  tagNameToId: Map<string, number>;
};

export type Plan = {
  actions: PlanAction[];
  localComponents: ComponentDefinition[];
  remoteState: RemoteState;
};

function buildFolderPathMaps(folders: RemoteFolder[]) {
  const idToFolder = new Map<number, RemoteFolder>();
  for (const f of folders) {
    idToFolder.set(f.id, f);
  }

  function buildPath(folder: RemoteFolder): string {
    const parts: string[] = [
      folder.name,
    ];
    let current = folder;
    while (current.parent_id !== null) {
      const parent = idToFolder.get(current.parent_id);
      if (!parent) {
        break;
      }
      parts.unshift(parent.name);
      current = parent;
    }
    return parts.join('/');
  }

  const pathToUuid = new Map<string, string>();
  const pathToId = new Map<string, number>();
  const pathToFolder = new Map<string, RemoteFolder>();

  for (const f of folders) {
    const p = buildPath(f);
    pathToUuid.set(p, f.uuid);
    pathToId.set(p, f.id);
    pathToFolder.set(p, f);
  }

  return {
    pathToUuid,
    pathToId,
    pathToFolder,
  };
}

function getRequiredFolderPaths(
  components: ComponentDefinition[],
): Set<string> {
  const paths = new Set<string>();
  for (const component of components) {
    if (!component.folder) {
      continue;
    }
    const segments = component.folder.split('/');
    for (let i = 1; i <= segments.length; i++) {
      paths.add(segments.slice(0, i).join('/'));
    }
  }
  return paths;
}

function getRequiredTagNames(components: ComponentDefinition[]): Set<string> {
  const names = new Set<string>();
  for (const component of components) {
    if (component.tags) {
      for (const tag of component.tags) {
        names.add(tag);
      }
    }
    for (const field of Object.values(component.schema)) {
      const f = field as Record<string, unknown>;
      for (const key of [
        '_allowed_tags',
        '_disallowed_tags',
      ] as const) {
        if (f[key]) {
          for (const tag of f[key] as string[]) {
            names.add(tag);
          }
        }
      }
    }
  }
  return names;
}

// --- Diff logic ---

const SCHEMA_IGNORED_KEYS = new Set([
  'pos',
]);

const NUMERIC_ARRAY_FIELDS = new Set([
  'internal_tag_ids',
  'component_tag_whitelist',
  'component_tag_denylist',
]);

function toNumberArray(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return value.map(Number);
}

function normalizeField(field: string, value: unknown): unknown {
  if (NUMERIC_ARRAY_FIELDS.has(field) && Array.isArray(value)) {
    return toNumberArray(value);
  }
  return value;
}

const MANAGED_FIELDS = [
  'display_name',
  'is_root',
  'is_nestable',
  'image',
  'preview_field',
  'component_group_uuid',
  'internal_tag_ids',
] as const;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((v, i) => deepEqual(v, b[i]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keys = new Set([
      ...Object.keys(aObj),
      ...Object.keys(bObj),
    ]);
    for (const key of keys) {
      if (!deepEqual(aObj[key], bObj[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function diffSchemaFields(
  localSchema: Record<string, unknown>,
  remoteSchema: Record<string, unknown>,
): FieldChange[] {
  const changes: FieldChange[] = [];

  const localFields = new Set(Object.keys(localSchema));
  const remoteFields = new Set(Object.keys(remoteSchema));

  for (const name of localFields) {
    if (!remoteFields.has(name)) {
      changes.push({
        path: `schema.${name}`,
        type: 'added',
      });
    }
  }

  for (const name of remoteFields) {
    if (!localFields.has(name)) {
      changes.push({
        path: `schema.${name}`,
        type: 'removed',
      });
    }
  }

  for (const name of localFields) {
    if (!remoteFields.has(name)) {
      continue;
    }

    const localField = localSchema[name] as Record<string, unknown>;
    const remoteField = remoteSchema[name] as Record<string, unknown>;

    for (const [prop, localValue] of Object.entries(localField)) {
      if (SCHEMA_IGNORED_KEYS.has(prop)) {
        continue;
      }
      const remoteValue = normalizeField(prop, remoteField[prop]);
      if (!deepEqual(localValue, remoteValue)) {
        changes.push({
          path: `schema.${name}.${prop}`,
          type: 'changed',
          local: localValue,
          remote: remoteValue,
        });
      }
    }
  }

  return changes;
}

export function diffComponent(
  desired: Record<string, unknown>,
  remote: Record<string, unknown>,
): FieldChange[] {
  const changes: FieldChange[] = [];

  for (const field of MANAGED_FIELDS) {
    if (desired[field] === undefined) {
      continue;
    }
    const localValue = desired[field];
    const remoteValue = normalizeField(field, remote[field]);
    if (!deepEqual(localValue, remoteValue)) {
      changes.push({
        path: field,
        type: remoteValue === undefined ? 'added' : 'changed',
        local: localValue,
        remote: remoteValue,
      });
    }
  }

  const desiredSchema = desired.schema as Record<string, unknown> | undefined;
  const remoteSchema = remote.schema as Record<string, unknown> | undefined;

  if (desiredSchema && remoteSchema) {
    changes.push(...diffSchemaFields(desiredSchema, remoteSchema));
  } else if (desiredSchema && !remoteSchema) {
    changes.push({
      path: 'schema',
      type: 'added',
    });
  } else if (!desiredSchema && remoteSchema) {
    changes.push({
      path: 'schema',
      type: 'removed',
    });
  }

  return changes;
}

export async function computePlan(
  api: StoryblokApi,
  localComponents: ComponentDefinition[],
): Promise<Plan> {
  const [componentsRes, foldersRes, tagsRes] = await Promise.all([
    api.getComponents(),
    api.getComponentFolders(),
    api.getInternalTags({
      by_object_type: 'component',
    }),
  ]);

  const remoteComponents: RemoteComponent[] = componentsRes.data.components;
  const remoteFolders: RemoteFolder[] = foldersRes.data.component_groups;
  const remoteTags: RemoteTag[] = tagsRes.data.internal_tags;

  const { pathToUuid, pathToId, pathToFolder } =
    buildFolderPathMaps(remoteFolders);

  const tagNameToId = new Map<string, number>();
  for (const tag of remoteTags) {
    tagNameToId.set(tag.name, tag.id);
  }

  const actions: PlanAction[] = [];

  // --- Folders ---
  const requiredFolders = getRequiredFolderPaths(localComponents);

  const sortedRequired = [
    ...requiredFolders,
  ].sort((a, b) => a.split('/').length - b.split('/').length);
  for (const folderPath of sortedRequired) {
    if (!pathToUuid.has(folderPath)) {
      actions.push({
        action: 'create',
        resourceType: 'folder',
        name: folderPath,
      });
      pathToUuid.set(folderPath, `pending:${folderPath}`);
    }
  }

  for (const [folderPath, folder] of pathToFolder) {
    if (!requiredFolders.has(folderPath)) {
      actions.push({
        action: 'delete',
        resourceType: 'folder',
        name: folderPath,
        remoteId: folder.id,
      });
    }
  }

  // --- Tags ---
  const requiredTags = getRequiredTagNames(localComponents);

  let pendingTagId = -1;
  for (const name of requiredTags) {
    if (!tagNameToId.has(name)) {
      actions.push({
        action: 'create',
        resourceType: 'tag',
        name,
      });
      tagNameToId.set(name, pendingTagId--);
    }
  }

  // --- Components ---
  const remoteByName = new Map<string, RemoteComponent>();
  for (const rc of remoteComponents) {
    remoteByName.set(rc.name, rc);
  }

  const localNames = new Set(localComponents.map((c) => c.name));

  for (const local of localComponents) {
    const remote = remoteByName.get(local.name);
    if (remote) {
      const desired = buildComponentPayload(local, pathToUuid, tagNameToId);
      const changes = diffComponent(desired as Record<string, unknown>, remote);

      if (changes.length > 0) {
        actions.push({
          action: 'update',
          resourceType: 'component',
          name: local.name,
          remoteId: remote.id,
          changes,
        });
      }
    } else {
      actions.push({
        action: 'create',
        resourceType: 'component',
        name: local.name,
      });
    }
  }

  for (const remote of remoteComponents) {
    if (!localNames.has(remote.name)) {
      actions.push({
        action: 'delete',
        resourceType: 'component',
        name: remote.name,
        remoteId: remote.id,
      });
    }
  }

  return {
    actions,
    localComponents,
    remoteState: {
      components: remoteComponents,
      folders: remoteFolders,
      tags: remoteTags,
      folderPathToUuid: pathToUuid,
      folderPathToId: pathToId,
      tagNameToId,
    },
  };
}
