import type { StoryblokApi } from './api/storyblok';
import type { ComponentDefinition } from './discover';
import { buildComponentPayload } from './payload';
import type { Plan, PlanAction } from './plan';

export type ApplyResult = {
  succeeded: Array<{
    action: PlanAction;
    id?: number;
  }>;
  failed: Array<{
    action: PlanAction;
    error: unknown;
  }>;
};

export async function applyPlan(
  api: StoryblokApi,
  plan: Plan,
): Promise<ApplyResult> {
  const result: ApplyResult = {
    succeeded: [],
    failed: [],
  };

  const folderPathToUuid = new Map(plan.remoteState.folderPathToUuid);
  const folderPathToId = new Map(plan.remoteState.folderPathToId);
  const tagNameToId = new Map(plan.remoteState.tagNameToId);

  // 1. Create folders (shallowest first — already sorted in plan)
  for (const action of plan.actions.filter(
    (a) => a.resourceType === 'folder' && a.action === 'create',
  )) {
    try {
      const segments = action.name.split('/');
      const folderName = segments[segments.length - 1];
      const parentPath = segments.slice(0, -1).join('/');
      const parentId = parentPath ? folderPathToId.get(parentPath) : undefined;

      const res = await api.createComponentFolder({
        name: folderName,
        ...(parentId !== undefined && {
          parent_id: parentId,
        }),
      });

      const created = res.data.component_group;
      folderPathToUuid.set(action.name, created.uuid);
      folderPathToId.set(action.name, created.id);
      result.succeeded.push({
        action,
        id: created.id,
      });
    } catch (error) {
      result.failed.push({
        action,
        error,
      });
    }
  }

  // 2. Create tags
  for (const action of plan.actions.filter(
    (a) => a.resourceType === 'tag' && a.action === 'create',
  )) {
    try {
      const res = await api.createInternalTag({
        name: action.name,
        object_type: 'component',
      });
      tagNameToId.set(res.data.internal_tag.name, res.data.internal_tag.id);
      result.succeeded.push({
        action,
        id: res.data.internal_tag.id,
      });
    } catch (error) {
      result.failed.push({
        action,
        error,
      });
    }
  }

  // 3. Create & update components
  const localByName = new Map<string, ComponentDefinition>();
  for (const c of plan.localComponents) {
    localByName.set(c.name, c);
  }

  for (const action of plan.actions.filter(
    (a) =>
      a.resourceType === 'component' &&
      (a.action === 'create' || a.action === 'update'),
  )) {
    const component = localByName.get(action.name);
    if (!component) {
      continue;
    }

    try {
      const payload = buildComponentPayload(
        component,
        folderPathToUuid,
        tagNameToId,
      );

      if (action.action === 'update' && action.remoteId !== undefined) {
        const res = await api.updateComponent({
          id: action.remoteId,
          ...payload,
        });
        result.succeeded.push({
          action,
          id: res.data.component.id,
        });
      } else {
        const res = await api.createComponent(payload);
        result.succeeded.push({
          action,
          id: res.data.component.id,
        });
      }
    } catch (error) {
      result.failed.push({
        action,
        error,
      });
    }
  }

  // 4. Delete orphaned components
  for (const action of plan.actions.filter(
    (a) => a.resourceType === 'component' && a.action === 'delete',
  )) {
    try {
      // biome-ignore lint/style/noNonNullAssertion: delete actions always have remoteId
      await api.deleteComponent(action.remoteId!);
      result.succeeded.push({
        action,
      });
    } catch (error) {
      result.failed.push({
        action,
        error,
      });
    }
  }

  // 5. Delete orphaned folders (deepest first)
  const folderDeletes = plan.actions
    .filter((a) => a.resourceType === 'folder' && a.action === 'delete')
    .sort((a, b) => b.name.split('/').length - a.name.split('/').length);

  for (const action of folderDeletes) {
    try {
      // biome-ignore lint/style/noNonNullAssertion: delete actions always have remoteId
      await api.deleteComponentFolder(action.remoteId!);
      result.succeeded.push({
        action,
      });
    } catch (error) {
      result.failed.push({
        action,
        error,
      });
    }
  }

  return result;
}
