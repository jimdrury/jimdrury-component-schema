import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoryblokApi } from './storyblok';

vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

function getMockClient() {
  const createMock = vi.mocked(axios.create);
  return createMock.mock.results[0]?.value as ReturnType<
    typeof axios.create
  > & {
    request: ReturnType<typeof vi.fn>;
  };
}

function getRetryInterceptor(): (error: unknown) => Promise<unknown> {
  const client = getMockClient();
  const useMock = vi.mocked(client.interceptors.response.use);
  return useMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;
}

describe('StoryblokApi', () => {
  const TOKEN = 'test-token';
  const SPACE_ID = '12345';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('creates an axios client with correct base URL and headers', () => {
      new StoryblokApi(TOKEN, SPACE_ID);
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`,
        headers: {
          Authorization: TOKEN,
          'Content-Type': 'application/json',
        },
      });
    });

    it('registers a response interceptor for retries', () => {
      new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      expect(client.interceptors.response.use).toHaveBeenCalledWith(
        undefined,
        expect.any(Function),
      );
    });
  });

  describe('retry interceptor', () => {
    it('rejects non-429 errors immediately', async () => {
      new StoryblokApi(TOKEN, SPACE_ID);
      const interceptor = getRetryInterceptor();

      const error = {
        config: {},
        response: {
          status: 500,
        },
      };
      await expect(interceptor(error)).rejects.toBe(error);
    });

    it('rejects when config is missing', async () => {
      new StoryblokApi(TOKEN, SPACE_ID);
      const interceptor = getRetryInterceptor();

      const error = {
        response: {
          status: 429,
          headers: {},
        },
      };
      await expect(interceptor(error)).rejects.toBe(error);
    });

    it('retries on 429 with exponential backoff', async () => {
      vi.useFakeTimers();
      new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      const interceptor = getRetryInterceptor();

      client.request.mockResolvedValue({
        data: 'ok',
      });

      const config = {
        _retryCount: undefined,
      };
      const error = {
        config,
        response: {
          status: 429,
          headers: {},
        },
      };

      const promise = interceptor(error);
      await vi.advanceTimersByTimeAsync(500);
      const result = await promise;

      expect(config._retryCount).toBe(1);
      expect(client.request).toHaveBeenCalledWith(config);
      expect(result).toEqual({
        data: 'ok',
      });
      vi.useRealTimers();
    });

    it('uses retry-after header when available', async () => {
      vi.useFakeTimers();
      new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      const interceptor = getRetryInterceptor();

      client.request.mockResolvedValue({
        data: 'ok',
      });

      const config = {};
      const error = {
        config,
        response: {
          status: 429,
          headers: {
            'retry-after': '2',
          },
        },
      };

      const promise = interceptor(error);
      await vi.advanceTimersByTimeAsync(2000);
      await promise;

      expect(client.request).toHaveBeenCalledWith(config);
      vi.useRealTimers();
    });

    it('rejects after exceeding max retries', async () => {
      new StoryblokApi(TOKEN, SPACE_ID);
      const interceptor = getRetryInterceptor();

      const error = {
        config: {
          _retryCount: 5,
        },
        response: {
          status: 429,
          headers: {},
        },
      };

      await expect(interceptor(error)).rejects.toBe(error);
    });
  });

  describe('getComponents', () => {
    it('calls GET /components with no params by default', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          components: [],
        },
      });

      await api.getComponents();
      expect(client.get).toHaveBeenCalledWith('/components', {
        params: {},
      });
    });

    it('passes validated params', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          components: [],
        },
      });

      await api.getComponents({
        is_root: true,
        search: 'hero',
      });
      expect(client.get).toHaveBeenCalledWith('/components', {
        params: {
          is_root: true,
          search: 'hero',
        },
      });
    });
  });

  describe('createComponent', () => {
    it('calls POST /components/ with component wrapper', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.post).mockResolvedValue({
        data: {
          component: {
            id: 1,
            name: 'hero',
          },
        },
      });

      await api.createComponent({
        name: 'hero',
        is_root: true,
      });
      expect(client.post).toHaveBeenCalledWith('/components/', {
        component: {
          name: 'hero',
          is_root: true,
        },
      });
    });
  });

  describe('updateComponent', () => {
    it('calls PUT /components/:id with component wrapper', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.put).mockResolvedValue({
        data: {
          component: {
            id: 1,
            name: 'hero',
          },
        },
      });

      await api.updateComponent({
        id: 1,
        name: 'hero_updated',
      });
      expect(client.put).toHaveBeenCalledWith('/components/1', {
        component: {
          id: 1,
          name: 'hero_updated',
        },
      });
    });
  });

  describe('deleteComponent', () => {
    it('calls DELETE /components/:id', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.delete).mockResolvedValue({
        data: {},
      });

      await api.deleteComponent(42);
      expect(client.delete).toHaveBeenCalledWith('/components/42');
    });
  });

  describe('getComponentFolders', () => {
    it('calls GET /component_groups/ with no params by default', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          component_groups: [],
        },
      });

      await api.getComponentFolders();
      expect(client.get).toHaveBeenCalledWith('/component_groups/', {
        params: {},
      });
    });
  });

  describe('getComponentFolder', () => {
    it('calls GET /component_groups/:id', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          component_group: {
            id: 5,
          },
        },
      });

      await api.getComponentFolder(5);
      expect(client.get).toHaveBeenCalledWith('/component_groups/5');
    });
  });

  describe('createComponentFolder', () => {
    it('calls POST /component_groups/ with wrapper', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.post).mockResolvedValue({
        data: {
          component_group: {
            id: 1,
            name: 'layout',
          },
        },
      });

      await api.createComponentFolder({
        name: 'layout',
      });
      expect(client.post).toHaveBeenCalledWith('/component_groups/', {
        component_group: {
          name: 'layout',
        },
      });
    });

    it('passes parent_id when provided', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.post).mockResolvedValue({
        data: {
          component_group: {
            id: 2,
            name: 'sub',
          },
        },
      });

      await api.createComponentFolder({
        name: 'sub',
        parent_id: 1,
      });
      expect(client.post).toHaveBeenCalledWith('/component_groups/', {
        component_group: {
          name: 'sub',
          parent_id: 1,
        },
      });
    });
  });

  describe('updateComponentFolder', () => {
    it('calls PUT /component_groups/:id with folder data', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.put).mockResolvedValue({
        data: {
          component_group: {
            id: 1,
            name: 'ui',
          },
        },
      });

      await api.updateComponentFolder({
        id: 1,
        name: 'ui',
      });
      expect(client.put).toHaveBeenCalledWith('/component_groups/1', {
        component_group: {
          name: 'ui',
        },
      });
    });
  });

  describe('deleteComponentFolder', () => {
    it('calls DELETE /component_groups/:id', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.delete).mockResolvedValue({
        data: {},
      });

      await api.deleteComponentFolder(10);
      expect(client.delete).toHaveBeenCalledWith('/component_groups/10');
    });
  });

  describe('getInternalTags', () => {
    it('calls GET /internal_tags/ with no params by default', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          internal_tags: [],
        },
      });

      await api.getInternalTags();
      expect(client.get).toHaveBeenCalledWith('/internal_tags/', {
        params: {},
      });
    });

    it('passes by_object_type param', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.get).mockResolvedValue({
        data: {
          internal_tags: [],
        },
      });

      await api.getInternalTags({
        by_object_type: 'component',
      });
      expect(client.get).toHaveBeenCalledWith('/internal_tags/', {
        params: {
          by_object_type: 'component',
        },
      });
    });
  });

  describe('createInternalTag', () => {
    it('calls POST /internal_tags/ with wrapper', async () => {
      const api = new StoryblokApi(TOKEN, SPACE_ID);
      const client = getMockClient();
      vi.mocked(client.post).mockResolvedValue({
        data: {
          internal_tag: {
            id: 1,
            name: 'layout',
          },
        },
      });

      await api.createInternalTag({
        name: 'layout',
        object_type: 'component',
      });
      expect(client.post).toHaveBeenCalledWith('/internal_tags/', {
        internal_tag: {
          name: 'layout',
          object_type: 'component',
        },
      });
    });
  });
});
