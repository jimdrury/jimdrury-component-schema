import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      exclude: ['**/__fixtures__/**'],
    },
  },
});
