import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StoryblokApi } from './api/storyblok';
import { applyPlan } from './apply';
import type { Plan, PlanAction } from './plan';

function createMockApi(overrides: Partial<Record<keyof StoryblokApi, unknown>> = {}): StoryblokApi {
  return {
    getComponents: vi.fn(),
    getComponentFolders: vi.fn(),
    getInternalTags: vi.fn(),
    createComponent: vi.fn().mockResolvedValue({ data: { component: { id: 100, name: 'test' } } }),
    updateComponent: vi.fn().mockResolvedValue({ data: { component: { id: 1, name: 'test' } } }),
    deleteComponent: vi.fn().mockResolvedValue({}),
    createComponentFolder: vi
      .fn()
      .mockResolvedValue({ data: { component_group: { id: 10, uuid: 'new-uuid', name: 'f' } } }),
    updateComponentFolder: vi.fn(),
    deleteComponentFolder: vi.fn().mockResolvedValue({}),
    getComponentFolder: vi.fn(),
    createInternalTag: vi
      .fn()
      .mockResolvedValue({ data: { internal_tag: { id: 20, name: 'tag' } } }),
    ...overrides,
  } as unknown as StoryblokApi;
}

function makePlan(overrides: Partial<Plan> = {}): Plan {
  return {
    actions: [],
    localComponents: [],
    remoteState: {
      components: [],
      folders: [],
      tags: [],
      folderPathToUuid: new Map(),
      folderPathToId: new Map(),
      tagNameToId: new Map(),
    },
    ...overrides,
  };
}

describe('applyPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty result when plan has no actions', async () => {
    const api = createMockApi();
    const result = await applyPlan(api, makePlan());

    expect(result.succeeded).toEqual([]);
    expect(result.failed).toEqual([]);
  });

  it('creates a new component', async () => {
    const api = createMockApi({
      createComponent: vi.fn().mockResolvedValue({
        data: { component: { id: 42, name: 'hero' } },
      }),
    });

    const action: PlanAction = { action: 'create', resourceType: 'component', name: 'hero' };
    const plan = makePlan({
      actions: [action],
      localComponents: [{ name: 'hero', schema: {} }],
    });

    const result = await applyPlan(api, plan);

    expect(api.createComponent).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'hero', schema: {} }),
    );
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0].id).toBe(42);
  });

  it('updates an existing component', async () => {
    const api = createMockApi({
      updateComponent: vi.fn().mockResolvedValue({
        data: { component: { id: 10, name: 'hero' } },
      }),
    });

    const action: PlanAction = {
      action: 'update',
      resourceType: 'component',
      name: 'hero',
      remoteId: 10,
    };
    const plan = makePlan({
      actions: [action],
      localComponents: [{ name: 'hero', schema: {} }],
    });

    const result = await applyPlan(api, plan);

    expect(api.updateComponent).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, name: 'hero', schema: {} }),
    );
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0].id).toBe(10);
  });

  it('deletes an orphaned component', async () => {
    const api = createMockApi();
    const action: PlanAction = {
      action: 'delete',
      resourceType: 'component',
      name: 'orphan',
      remoteId: 99,
    };
    const plan = makePlan({ actions: [action] });

    const result = await applyPlan(api, plan);

    expect(api.deleteComponent).toHaveBeenCalledWith(99);
    expect(result.succeeded).toHaveLength(1);
  });

  it('creates a missing folder', async () => {
    const api = createMockApi({
      createComponentFolder: vi.fn().mockResolvedValue({
        data: { component_group: { id: 5, uuid: 'new-uuid', name: 'content' } },
      }),
    });

    const action: PlanAction = { action: 'create', resourceType: 'folder', name: 'content' };
    const plan = makePlan({ actions: [action] });

    const result = await applyPlan(api, plan);

    expect(api.createComponentFolder).toHaveBeenCalledWith({ name: 'content' });
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0].id).toBe(5);
  });

  it('creates nested folders with correct parent_id', async () => {
    const createdFolders: string[] = [];
    const api = createMockApi({
      createComponentFolder: vi
        .fn()
        .mockImplementation(async (params: { name: string; parent_id?: number }) => {
          createdFolders.push(params.name);
          const id = createdFolders.length * 10;
          return {
            data: {
              component_group: { id, uuid: `uuid-${params.name}`, name: params.name },
            },
          };
        }),
    });

    const plan = makePlan({
      actions: [
        { action: 'create', resourceType: 'folder', name: 'layout' },
        { action: 'create', resourceType: 'folder', name: 'layout/grid' },
      ],
    });

    const result = await applyPlan(api, plan);

    expect(createdFolders).toEqual(['layout', 'grid']);
    expect(api.createComponentFolder).toHaveBeenNthCalledWith(1, { name: 'layout' });
    expect(api.createComponentFolder).toHaveBeenNthCalledWith(2, {
      name: 'grid',
      parent_id: 10,
    });
    expect(result.succeeded).toHaveLength(2);
  });

  it('deletes orphaned folders deepest-first', async () => {
    const deleted: number[] = [];
    const api = createMockApi({
      deleteComponentFolder: vi.fn().mockImplementation(async (id: number) => {
        deleted.push(id);
      }),
    });

    const plan = makePlan({
      actions: [
        { action: 'delete', resourceType: 'folder', name: 'layout', remoteId: 1 },
        { action: 'delete', resourceType: 'folder', name: 'layout/grid', remoteId: 2 },
      ],
    });

    await applyPlan(api, plan);

    expect(deleted).toEqual([2, 1]);
  });

  it('creates tags before components that reference them', async () => {
    const callOrder: string[] = [];
    const api = createMockApi({
      createInternalTag: vi.fn().mockImplementation(async () => {
        callOrder.push('tag');
        return { data: { internal_tag: { id: 7, name: 'layout' } } };
      }),
      createComponent: vi.fn().mockImplementation(async () => {
        callOrder.push('component');
        return { data: { component: { id: 50, name: 'grid' } } };
      }),
    });

    const plan = makePlan({
      actions: [
        { action: 'create', resourceType: 'tag', name: 'layout' },
        { action: 'create', resourceType: 'component', name: 'grid' },
      ],
      localComponents: [{ name: 'grid', schema: {}, tags: ['layout'] }],
    });

    await applyPlan(api, plan);

    expect(callOrder).toEqual(['tag', 'component']);
    expect(api.createComponent).toHaveBeenCalledWith(
      expect.objectContaining({ internal_tag_ids: [7] }),
    );
  });

  it('resolves folder uuid on component when creating both', async () => {
    const api = createMockApi({
      createComponentFolder: vi.fn().mockResolvedValue({
        data: { component_group: { id: 5, uuid: 'content-uuid', name: 'content' } },
      }),
      createComponent: vi.fn().mockResolvedValue({
        data: { component: { id: 30, name: 'blog' } },
      }),
    });

    const plan = makePlan({
      actions: [
        { action: 'create', resourceType: 'folder', name: 'content' },
        { action: 'create', resourceType: 'component', name: 'blog' },
      ],
      localComponents: [{ name: 'blog', schema: {}, folder: 'content' }],
    });

    const result = await applyPlan(api, plan);

    expect(api.createComponent).toHaveBeenCalledWith(
      expect.objectContaining({ component_group_uuid: 'content-uuid' }),
    );
    expect(result.succeeded).toHaveLength(2);
  });

  it('reports failed actions without stopping execution', async () => {
    const api = createMockApi({
      createComponent: vi.fn().mockRejectedValue(new Error('API error')),
      deleteComponent: vi.fn().mockResolvedValue({}),
    });

    const plan = makePlan({
      actions: [
        { action: 'create', resourceType: 'component', name: 'broken' },
        { action: 'delete', resourceType: 'component', name: 'orphan', remoteId: 99 },
      ],
      localComponents: [{ name: 'broken', schema: {} }],
    });

    const result = await applyPlan(api, plan);

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].action.name).toBe('broken');
    expect(result.succeeded).toHaveLength(1);
    expect(result.succeeded[0].action.name).toBe('orphan');
  });

  it('resolves _allowed_tags in schema during apply', async () => {
    const api = createMockApi({
      createComponent: vi.fn().mockResolvedValue({
        data: { component: { id: 70, name: 'page' } },
      }),
    });

    const plan = makePlan({
      actions: [{ action: 'create', resourceType: 'component', name: 'page' }],
      localComponents: [
        {
          name: 'page',
          schema: { children: { type: 'bloks', _allowed_tags: ['ui'] } },
        },
      ],
      remoteState: {
        components: [],
        folders: [],
        tags: [{ id: 10, name: 'ui', object_type: 'component' }],
        folderPathToUuid: new Map(),
        folderPathToId: new Map(),
        tagNameToId: new Map([['ui', 10]]),
      },
    });

    await applyPlan(api, plan);

    expect(api.createComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: {
          children: expect.objectContaining({
            restrict_type: 'tags',
            restrict_components: true,
            component_tag_whitelist: [10],
            component_tag_denylist: [],
          }),
        },
      }),
    );
  });
});
