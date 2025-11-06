import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.config.ts',
        '.t0t-figma/templates/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      all: true,
    },

    // Test file patterns
    include: ['tests/**/*.test.ts'],

    // Watch mode settings
    watch: false,

    // Globals
    globals: true,

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
