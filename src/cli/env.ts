import { config } from 'dotenv';
import z from 'zod';
import { StoryblokApi } from './api/storyblok';

const envSchema = z.object({
  STORYBLOK_API_TOKEN: z.string(),
  STORYBLOK_SPACE_ID: z.string(),
});

export function loadEnv(): StoryblokApi {
  config({
    path: [
      '.env',
      '.env.local',
    ],
    quiet: true,
  });

  const env = envSchema.parse(process.env);

  return new StoryblokApi(env.STORYBLOK_API_TOKEN, env.STORYBLOK_SPACE_ID);
}
