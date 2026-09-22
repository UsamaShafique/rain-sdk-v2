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
      // Non-regression floors set just under the Phase 1 measured coverage.
      // Ratchet these up as more suites land (money-path target: src/tx ≥ 80%).
      thresholds: {
        lines: 20,
        statements: 20,
        branches: 38,
        functions: 7,
        // Money-path builders — held to a higher bar and ratcheting toward 80%.
        'src/tx/**': { lines: 60, statements: 50, branches: 50, functions: 55 },
      },
    },
  },
});
