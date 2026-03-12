import { config } from 'dotenv';
import z from 'zod';
import { StoryblokApi } from './api/storyblok';

config({
  path: [
    '.env',
    '.env.local',
  ],
  quiet: true,
});

const envSchema = z.object({
  STORYBLOK_API_TOKEN: z.string(),
  STORYBLOK_SPACE_ID: z.string(),
});

const env = envSchema.parse(process.env);

export const storyblokApi = new StoryblokApi(
  env.STORYBLOK_API_TOKEN,
  env.STORYBLOK_SPACE_ID,
);
