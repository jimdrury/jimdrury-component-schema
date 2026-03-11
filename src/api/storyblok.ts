import axios, { type AxiosInstance } from 'axios';
import {
  type CreateComponentFolderParams,
  CreateComponentFolderSchema,
  type CreateComponentParams,
  CreateComponentSchema,
  type CreateInternalTagParams,
  CreateInternalTagSchema,
  type GetComponentFoldersParams,
  GetComponentFoldersSchema,
  type GetComponentsParams,
  GetComponentsSchema,
  type GetInternalTagsParams,
  GetInternalTagsSchema,
  type UpdateComponentFolderParams,
  UpdateComponentFolderSchema,
  type UpdateComponentParams,
  UpdateComponentSchema,
} from './storyblok.interface';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class StoryblokApi {
  private client: AxiosInstance;

  constructor(
    private readonly apiToken: string,
    private readonly spaceId: string,
  ) {
    this.client = axios.create({
      baseURL: `https://mapi.storyblok.com/v1/spaces/${this.spaceId}`,
      headers: {
        Authorization: `${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(undefined, async (error) => {
      const config = error.config;
      if (!config || error.response?.status !== 429) {
        return Promise.reject(error);
      }

      config._retryCount = (config._retryCount ?? 0) + 1;
      if (config._retryCount > MAX_RETRIES) {
        return Promise.reject(error);
      }

      const retryAfter = error.response.headers['retry-after'];
      const waitMs = retryAfter
        ? Number(retryAfter) * 1000
        : BASE_DELAY_MS * 2 ** (config._retryCount - 1);

      await delay(waitMs);
      return this.client.request(config);
    });
  }

  getComponents(_params: GetComponentsParams = {}) {
    const validatedParams = GetComponentsSchema.parse(_params);
    return this.client.get('/components', { params: validatedParams });
  }

  createComponent(_params: CreateComponentParams) {
    const validatedParams = CreateComponentSchema.parse(_params);
    return this.client.post('/components/', { component: validatedParams });
  }

  updateComponent(_params: UpdateComponentParams) {
    const validatedParams = UpdateComponentSchema.parse(_params);
    const { id, ...componentData } = validatedParams;
    return this.client.put(`/components/${id}`, { component: { id, ...componentData } });
  }

  deleteComponent(componentId: number) {
    return this.client.delete(`/components/${componentId}`);
  }

  // Component Folders (component_groups)

  getComponentFolders(_params: GetComponentFoldersParams = {}) {
    const validatedParams = GetComponentFoldersSchema.parse(_params);
    return this.client.get('/component_groups/', { params: validatedParams });
  }

  getComponentFolder(componentGroupId: number) {
    return this.client.get(`/component_groups/${componentGroupId}`);
  }

  createComponentFolder(_params: CreateComponentFolderParams) {
    const validatedParams = CreateComponentFolderSchema.parse(_params);
    return this.client.post('/component_groups/', { component_group: validatedParams });
  }

  updateComponentFolder(_params: UpdateComponentFolderParams) {
    const validatedParams = UpdateComponentFolderSchema.parse(_params);
    const { id, ...folderData } = validatedParams;
    return this.client.put(`/component_groups/${id}`, { component_group: folderData });
  }

  deleteComponentFolder(componentGroupId: number) {
    return this.client.delete(`/component_groups/${componentGroupId}`);
  }

  // Internal Tags

  getInternalTags(_params: GetInternalTagsParams = {}) {
    const validatedParams = GetInternalTagsSchema.parse(_params);
    return this.client.get('/internal_tags/', { params: validatedParams });
  }

  createInternalTag(_params: CreateInternalTagParams) {
    const validatedParams = CreateInternalTagSchema.parse(_params);
    return this.client.post('/internal_tags/', { internal_tag: validatedParams });
  }
}
