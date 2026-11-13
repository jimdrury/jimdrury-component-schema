import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentDefinition } from "../schema/component-definition";
import type { StoryblokApi } from "./api/storyblok";
import { computePlan, diffComponent } from "./plan";

function createMockApi(
  overrides: Partial<Record<keyof StoryblokApi, unknown>> = {},
): StoryblokApi {
  return {
    getComponents: vi.fn().mockResolvedValue({
      data: {
        components: [],
      },
    }),
    getComponentFolders: vi.fn().mockResolvedValue({
      data: {
        component_groups: [],
      },
    }),
    getInternalTags: vi.fn().mockResolvedValue({
      data: {
        internal_tags: [],
      },
    }),
    createComponent: vi.fn(),
    updateComponent: vi.fn(),
    deleteComponent: vi.fn(),
    createComponentFolder: vi.fn(),
    updateComponentFolder: vi.fn(),
    deleteComponentFolder: vi.fn(),
    getComponentFolder: vi.fn(),
    createInternalTag: vi.fn(),
    ...overrides,
  } as unknown as StoryblokApi;
}

function makeComponent(
  overrides: Partial<ComponentDefinition> = {},
): ComponentDefinition {
  return {
    name: "test",
    schema: {},
    ...overrides,
  };
}

describe("computePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns no actions when local and remote are both empty", async () => {
    const api = createMockApi();
    const plan = await computePlan(api, []);

    expect(plan.actions).toEqual([]);
  });

  it("marks a local component as create when it does not exist remotely", async () => {
    const api = createMockApi();
    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
      }),
    ]);

    expect(plan.actions).toContainEqual({
      action: "create",
      resourceType: "component",
      name: "hero",
    });
  });

  it("marks a local component as update when it differs from remote", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 10,
              schema: {
                title: {
                  type: "text",
                },
              },
              is_root: false,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
        schema: {
          title: {
            type: "text",
            required: true,
          },
        },
      }),
    ]);

    const action = plan.actions.find(
      (a) => a.resourceType === "component" && a.name === "hero",
    );
    expect(action).toBeDefined();
    expect(action?.action).toBe("update");
    expect(action?.remoteId).toBe(10);
    expect(action?.changes).toBeDefined();
    expect(action?.changes?.length).toBeGreaterThan(0);
  });

  it("does not mark a component as update when local matches remote", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 10,
              schema: {
                title: {
                  type: "text",
                },
              },
              is_root: false,
              display_name: "Hero",
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
        schema: {
          title: {
            type: "text",
          },
        },
        is_root: false,
        display_name: "Hero",
      }),
    ]);

    const componentActions = plan.actions.filter(
      (a) => a.resourceType === "component" && a.name === "hero",
    );
    expect(componentActions).toEqual([]);
  });

  it("does not mark a component as update when remote settings are empty", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 10,
              schema: {},
              is_root: false,
              is_nestable: true,
              description: null,
              image: null,
              preview_field: null,
              preview_tmpl: null,
              icon: null,
              color: null,
              content_type_asset_preview: null,
              component_group_uuid: null,
              internal_tag_ids: [],
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
        is_root: false,
        is_nestable: true,
      }),
    ]);

    expect(plan.actions).toEqual([]);
  });

  it("plans removal of settings that are set remotely but omitted locally", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 10,
              schema: {},
              description: "Hero banner.",
              image: "//a.storyblok.com/hero.png",
              preview_field: "title",
              preview_tmpl: "{{ it.title }}",
              icon: "block-image",
              color: "#1b243f",
              content_type_asset_preview: "cover",
              component_group_uuid: "ui-uuid",
              internal_tag_ids: ["3"],
            },
          ],
        },
      }),
      getComponentFolders: vi.fn().mockResolvedValue({
        data: {
          component_groups: [
            {
              id: 1,
              name: "ui",
              uuid: "ui-uuid",
              parent_id: null,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
      }),
    ]);

    const action = plan.actions.find(
      (a) => a.resourceType === "component" && a.name === "hero",
    );
    expect(action?.action).toBe("update");
    expect(action?.changes).toEqual([
      {
        path: "description",
        type: "removed",
        local: null,
        remote: "Hero banner.",
      },
      {
        path: "image",
        type: "removed",
        local: null,
        remote: "//a.storyblok.com/hero.png",
      },
      {
        path: "preview_field",
        type: "removed",
        local: null,
        remote: "title",
      },
      {
        path: "preview_tmpl",
        type: "removed",
        local: null,
        remote: "{{ it.title }}",
      },
      {
        path: "icon",
        type: "removed",
        local: null,
        remote: "block-image",
      },
      {
        path: "color",
        type: "removed",
        local: null,
        remote: "#1b243f",
      },
      {
        path: "content_type_asset_preview",
        type: "removed",
        local: null,
        remote: "cover",
      },
      {
        path: "component_group_uuid",
        type: "removed",
        local: null,
        remote: "ui-uuid",
      },
      {
        path: "internal_tag_ids",
        type: "changed",
        local: [],
        remote: [3],
      },
    ]);
  });

  it("ignores Storyblok metadata like pos when comparing schema fields", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 10,
              schema: {
                title: {
                  type: "text",
                  pos: 0,
                },
                body: {
                  type: "richtext",
                  pos: 1,
                },
              },
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "hero",
        schema: {
          title: {
            type: "text",
          },
          body: {
            type: "richtext",
          },
        },
      }),
    ]);

    const componentActions = plan.actions.filter(
      (a) => a.resourceType === "component" && a.name === "hero",
    );
    expect(componentActions).toEqual([]);
  });

  it("marks a remote component as delete when it does not exist locally", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "orphan",
              id: 99,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, []);

    expect(plan.actions).toContainEqual({
      action: "delete",
      resourceType: "component",
      name: "orphan",
      remoteId: 99,
    });
  });

  it("plans create, update, and delete in a mixed scenario", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "existing",
              id: 1,
              schema: {
                old_field: {
                  type: "text",
                },
              },
            },
            {
              name: "stale",
              id: 2,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "existing",
        schema: {
          new_field: {
            type: "text",
          },
        },
      }),
      makeComponent({
        name: "brand_new",
      }),
    ]);

    const names = plan.actions
      .filter((a) => a.resourceType === "component")
      .map((a) => ({
        action: a.action,
        name: a.name,
      }));

    expect(names).toContainEqual({
      action: "update",
      name: "existing",
    });
    expect(names).toContainEqual({
      action: "create",
      name: "brand_new",
    });
    expect(names).toContainEqual({
      action: "delete",
      name: "stale",
    });
  });

  it("plans folder creation when a local component references a missing folder", async () => {
    const api = createMockApi();
    const plan = await computePlan(api, [
      makeComponent({
        name: "blog",
        folder: "content",
      }),
    ]);

    expect(plan.actions).toContainEqual({
      action: "create",
      resourceType: "folder",
      name: "content",
    });
  });

  it("does not plan folder creation when the folder exists remotely", async () => {
    const api = createMockApi({
      getComponentFolders: vi.fn().mockResolvedValue({
        data: {
          component_groups: [
            {
              id: 1,
              name: "content",
              uuid: "c-uuid",
              parent_id: null,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "blog",
        folder: "content",
      }),
    ]);

    const folderCreates = plan.actions.filter(
      (a) => a.resourceType === "folder" && a.action === "create",
    );
    expect(folderCreates).toEqual([]);
  });

  it("plans folder deletion when a remote folder is not referenced locally", async () => {
    const api = createMockApi({
      getComponentFolders: vi.fn().mockResolvedValue({
        data: {
          component_groups: [
            {
              id: 5,
              name: "legacy",
              uuid: "l-uuid",
              parent_id: null,
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, []);

    expect(plan.actions).toContainEqual({
      action: "delete",
      resourceType: "folder",
      name: "legacy",
      remoteId: 5,
    });
  });

  it("plans nested folder paths as individual create actions", async () => {
    const api = createMockApi();
    const plan = await computePlan(api, [
      makeComponent({
        name: "widget",
        folder: "layout/grid",
      }),
    ]);

    const folderCreates = plan.actions
      .filter((a) => a.resourceType === "folder" && a.action === "create")
      .map((a) => a.name);

    expect(folderCreates).toEqual(["layout", "layout/grid"]);
  });

  it("plans tag creation when a local component references a missing tag", async () => {
    const api = createMockApi();
    const plan = await computePlan(api, [
      makeComponent({
        name: "grid",
        tags: ["layout"],
      }),
    ]);

    expect(plan.actions).toContainEqual({
      action: "create",
      resourceType: "tag",
      name: "layout",
    });
  });

  it("does not plan tag creation when the tag exists remotely", async () => {
    const api = createMockApi({
      getInternalTags: vi.fn().mockResolvedValue({
        data: {
          internal_tags: [
            {
              id: 3,
              name: "layout",
              object_type: "component",
            },
          ],
        },
      }),
    });

    const plan = await computePlan(api, [
      makeComponent({
        name: "grid",
        tags: ["layout"],
      }),
    ]);

    const tagCreates = plan.actions.filter(
      (a) => a.resourceType === "tag" && a.action === "create",
    );
    expect(tagCreates).toEqual([]);
  });

  it("discovers tags referenced in schema _allowed_tags and _disallowed_tags", async () => {
    const api = createMockApi();

    const plan = await computePlan(api, [
      makeComponent({
        name: "page",
        schema: {
          body: {
            type: "bloks",
            _allowed_tags: ["ui"],
          },
          sidebar: {
            type: "bloks",
            _disallowed_tags: ["internal"],
          },
        },
      }),
    ]);

    const tagCreates = plan.actions
      .filter((a) => a.resourceType === "tag" && a.action === "create")
      .map((a) => a.name);

    expect(tagCreates).toContain("ui");
    expect(tagCreates).toContain("internal");
  });

  it("preserves localComponents and remoteState on the plan", async () => {
    const api = createMockApi({
      getComponents: vi.fn().mockResolvedValue({
        data: {
          components: [
            {
              name: "hero",
              id: 1,
            },
          ],
        },
      }),
      getComponentFolders: vi.fn().mockResolvedValue({
        data: {
          component_groups: [
            {
              id: 2,
              name: "ui",
              uuid: "u",
              parent_id: null,
            },
          ],
        },
      }),
      getInternalTags: vi.fn().mockResolvedValue({
        data: {
          internal_tags: [
            {
              id: 3,
              name: "layout",
              object_type: "component",
            },
          ],
        },
      }),
    });

    const local = [
      makeComponent({
        name: "hero",
        folder: "ui",
        tags: ["layout"],
      }),
    ];
    const plan = await computePlan(api, local);

    expect(plan.localComponents).toBe(local);
    expect(plan.remoteState.components).toEqual([
      {
        name: "hero",
        id: 1,
      },
    ]);
    expect(plan.remoteState.folderPathToUuid.get("ui")).toBe("u");
    expect(plan.remoteState.tagNameToId.get("layout")).toBe(3);
  });
});

describe("diffComponent", () => {
  it("returns empty array when desired matches remote", () => {
    const desired = {
      name: "hero",
      display_name: "Hero",
      is_root: true,
      schema: {
        title: {
          type: "text",
        },
      },
    };
    const remote = {
      name: "hero",
      id: 10,
      display_name: "Hero",
      is_root: true,
      schema: {
        title: {
          type: "text",
          pos: 0,
        },
      },
      created_at: "2024-01-01",
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("detects changed top-level field", () => {
    const desired = {
      name: "hero",
      display_name: "New Hero",
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      display_name: "Old Hero",
      schema: {},
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "display_name",
      type: "changed",
      local: "New Hero",
      remote: "Old Hero",
    });
  });

  it("detects added schema field", () => {
    const desired = {
      name: "hero",
      schema: {
        title: {
          type: "text",
        },
        body: {
          type: "richtext",
        },
      },
    };
    const remote = {
      name: "hero",
      id: 10,
      schema: {
        title: {
          type: "text",
        },
      },
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "schema.body",
      type: "added",
    });
  });

  it("detects removed schema field", () => {
    const desired = {
      name: "hero",
      schema: {
        title: {
          type: "text",
        },
      },
    };
    const remote = {
      name: "hero",
      id: 10,
      schema: {
        title: {
          type: "text",
        },
        old: {
          type: "text",
        },
      },
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "schema.old",
      type: "removed",
    });
  });

  it("detects changed schema field property", () => {
    const desired = {
      name: "hero",
      schema: {
        title: {
          type: "text",
          required: true,
        },
      },
    };
    const remote = {
      name: "hero",
      id: 10,
      schema: {
        title: {
          type: "text",
          required: false,
        },
      },
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "schema.title.required",
      type: "changed",
      local: true,
      remote: false,
    });
  });

  it("ignores pos in remote schema fields", () => {
    const desired = {
      name: "hero",
      schema: {
        title: {
          type: "text",
        },
      },
    };
    const remote = {
      name: "hero",
      id: 10,
      schema: {
        title: {
          type: "text",
          pos: 0,
        },
      },
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("compares internal_tag_ids", () => {
    const desired = {
      name: "hero",
      internal_tag_ids: [1, 2],
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      internal_tag_ids: [1],
      schema: {},
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "internal_tag_ids",
      type: "changed",
      local: [1, 2],
      remote: [1],
    });
  });

  it("compares component_group_uuid", () => {
    const desired = {
      name: "hero",
      component_group_uuid: "new-uuid",
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      component_group_uuid: "old-uuid",
      schema: {},
    };

    const changes = diffComponent(desired, remote);
    expect(changes).toContainEqual({
      path: "component_group_uuid",
      type: "changed",
      local: "new-uuid",
      remote: "old-uuid",
    });
  });

  it("compares editor display settings", () => {
    const desired = {
      name: "hero",
      icon: "block-image",
      color: "#1b243f",
      preview_tmpl: "{{ it.title }}",
      content_type_asset_preview: "cover",
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      icon: null,
      color: "#000000",
      preview_tmpl: "{{ it.name }}",
      content_type_asset_preview: "image",
      schema: {},
    };

    expect(diffComponent(desired, remote)).toEqual([
      {
        path: "preview_tmpl",
        type: "changed",
        local: "{{ it.title }}",
        remote: "{{ it.name }}",
      },
      {
        path: "icon",
        type: "added",
        local: "block-image",
        remote: null,
      },
      {
        path: "color",
        type: "changed",
        local: "#1b243f",
        remote: "#000000",
      },
      {
        path: "content_type_asset_preview",
        type: "changed",
        local: "cover",
        remote: "image",
      },
    ]);
  });

  it("treats missing remote tag IDs as an empty list", () => {
    const desired = {
      name: "hero",
      internal_tag_ids: [],
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      schema: {},
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("normalizes string IDs from Storyblok to numbers before comparing", () => {
    const desired = {
      name: "hero",
      internal_tag_ids: [123],
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      internal_tag_ids: ["123"],
      schema: {},
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("normalizes tag IDs in schema restriction fields", () => {
    const desired = {
      name: "page",
      schema: {
        body: {
          type: "bloks",
          restrict_type: "tags",
          component_tag_whitelist: [10],
          component_tag_denylist: [],
        },
      },
    };
    const remote = {
      name: "page",
      id: 1,
      schema: {
        body: {
          type: "bloks",
          restrict_type: "tags",
          component_tag_whitelist: ["10"],
          component_tag_denylist: [],
        },
      },
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("treats omitted empty component restriction lists as empty lists", () => {
    const desired = {
      name: "page",
      schema: {
        content: {
          type: "bloks",
          restrict_type: "groups",
          restrict_components: true,
          component_whitelist: [],
          component_denylist: [],
        },
      },
    };
    const remote = {
      name: "page",
      id: 1,
      schema: {
        content: {
          type: "bloks",
          restrict_type: "groups",
          restrict_components: true,
        },
      },
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("skips fields not in the desired payload", () => {
    const desired = {
      name: "hero",
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      display_name: "Hero",
      is_root: true,
      schema: {},
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });

  it("skips undefined fields in the desired payload", () => {
    const desired = {
      name: "hero",
      display_name: "Hero",
      image: undefined,
      preview_field: undefined,
      schema: {},
    };
    const remote = {
      name: "hero",
      id: 10,
      display_name: "Hero",
      image: "//a.storyblok.com/some-image.png",
      preview_field: "body",
      schema: {},
    };

    expect(diffComponent(desired, remote)).toEqual([]);
  });
});
