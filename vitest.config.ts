import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Measure source logic only. ABIs are generated data constants (no logic),
      // and the barrel re-export / type-only files carry no testable branches.
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/abi/**',
        'src/index.ts',
        'src/types.ts',
        'src/**/types.ts',
        'dist/**',
        'test/**',
      ],
      // Thresholds intentionally omitted for the Phase 0 baseline measurement.
      // They will be set in Phase 1 from the numbers below.
    },
  },
});
