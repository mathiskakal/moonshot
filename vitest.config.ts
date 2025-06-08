/**
 * Vitest Configuration for RexMax Structured Logging Cleanup Tests
 * Part of Phase C Testing Framework
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/electron/__tests__/setup.ts'],
    include: [
      'src/electron/**/*.test.ts',
      'src/electron/**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/electron/services/**/*.ts',
        'src/electron/database.ts'
      ],
      exclude: [
        'src/electron/**/*.test.ts',
        'src/electron/**/*.spec.ts',
        'src/electron/**/__tests__/**',
        'src/electron/types/**',
        'src/electron/config/**'
      ],      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@electron': path.resolve(__dirname, './src/electron'),
      '@services': path.resolve(__dirname, './src/electron/services')
    }
  }
});
