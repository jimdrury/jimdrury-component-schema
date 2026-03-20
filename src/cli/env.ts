import { config } from 'dotenv';
import z from 'zod';
import { StoryblokApi } from './api/storyblok';
import type { Config } from './config';

const envSchema = z.object({
  STORYBLOK_API_TOKEN: z.string(),
  STORYBLOK_SPACE_ID: z.string(),
});

export function loadDotenv(): void {
  config({
    path: [
      '.env',
      '.env.local',
    ],
    quiet: true,
  });
}

export function loadEnv(configFile?: Config): StoryblokApi {
  const apiToken = configFile?.storyblok?.apiToken;
  const spaceId = configFile?.storyblok?.spaceId;

  if (apiToken && spaceId) {
    return new StoryblokApi(apiToken, spaceId);
  }

  const env = envSchema.parse(process.env);
  return new StoryblokApi(env.STORYBLOK_API_TOKEN, env.STORYBLOK_SPACE_ID);
}
