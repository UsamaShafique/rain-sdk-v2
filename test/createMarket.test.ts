import { describe, it, expect } from 'vitest';
import { validateCreateMarketParams } from '../src/tx/CreateMarket/createMarketValidation.js';
import type { CreateMarketTxParams } from '../src/tx/types.js';

const ADDR = '0x0000000000000000000000000000000000000001' as `0x${string}`;

function base(overrides: Partial<CreateMarketTxParams> = {}): CreateMarketTxParams {
  return {
    marketQuestion: 'Will it rain?',
    marketOptions: ['Yes', 'No'],
    marketTags: ['weather'],
    marketDescription: 'desc',
    isPublic: true,
    isPublicPoolResolverAi: true,
    creator: ADDR,
    startTime: 1_000n,
    endTime: 2_000n,
    no_of_options: 2n,
    disputeTimer: 259200,
    inputAmountWei: 1_000_000n, // 1 USDT @ 6dp, above the $0.1 min
    barValues: [50, 50],
    baseToken: ADDR,
    marketImage: 'https://x/y.png',
    factoryContractAddress: ADDR,
    tokenDecimals: 6,
    ...overrides,
  };
}

describe('validateCreateMarketParams cross-field checks', () => {
  it('accepts a well-formed 2-option market', () => {
    expect(validateCreateMarketParams(base())).toBe(true);
  });

  it('rejects barValues that do not sum to 100', () => {
    expect(() => validateCreateMarketParams(base({ barValues: [60, 60] }))).toThrow(/sum to 100/);
  });

  it('rejects a barValue outside 0..100', () => {
    expect(() => validateCreateMarketParams(base({ barValues: [120, -20] }))).toThrow(/between 0 and 100/);
  });

  it('rejects barValues length != no_of_options', () => {
    expect(() => validateCreateMarketParams(base({ barValues: [34, 33, 33], no_of_options: 2n }))).toThrow(/barValues length/);
  });

  it('rejects marketOptions length != no_of_options', () => {
    expect(() => validateCreateMarketParams(base({ marketOptions: ['Yes'], barValues: [100], no_of_options: 2n }))).toThrow(/marketOptions length|barValues length/);
  });

  it('rejects no_of_options < 2', () => {
    expect(() => validateCreateMarketParams(base({ no_of_options: 1n, marketOptions: ['Yes'], barValues: [100] }))).toThrow(/at least 2/);
  });

  it('rejects initialYesPrices out of (0, 1e18)', () => {
    expect(() => validateCreateMarketParams(base({ initialYesPrices: [0n, 5n * 10n ** 17n] }))).toThrow(/0, 1e18|within/);
  });

  it('rejects initialYesPrices length mismatch', () => {
    expect(() => validateCreateMarketParams(base({ initialYesPrices: [5n * 10n ** 17n] }))).toThrow(/initialYesPrices length/);
  });

  it('accepts valid initialYesPrices', () => {
    expect(validateCreateMarketParams(base({ initialYesPrices: [5n * 10n ** 17n, 5n * 10n ** 17n] }))).toBe(true);
  });
});
