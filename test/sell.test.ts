import { describe, it, expect, vi } from 'vitest';
import { decodeFunctionData } from 'viem';

// Mock the on-chain quote so the auto-slippage path is deterministic and offline.
vi.mock('../src/markets/getSellProceeds.js', () => ({
  getSellProceeds: vi.fn(async () => ({ proceeds: 10000n, sharesSold: 1000n })),
}));

import { buildSellOptionRawTx } from '../src/tx/buildSellOptionRawTx.js';
import { MarketsAbi } from '../src/abi/MarketsAbi.js';

const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const base = {
  marketContractAddress: MARKET,
  selectedOption: 1n,
  optionSide: 1 as const,
  sharesAmount: 1000n,
  rpcUrl: 'http://127.0.0.1:1', // mock ignores it
};

function minOutOf(tx: { data: `0x${string}` }): bigint {
  return decodeFunctionData({ abi: MarketsAbi, data: tx.data }).args?.[3] as bigint;
}

describe('buildSellOptionRawTx auto-slippage', () => {
  it('derives minAmountOut from getSellProceeds with the default 5% floor', async () => {
    const tx = await buildSellOptionRawTx({ ...base });
    // 10000 * (100 - 5) / 100 = 9500
    expect(minOutOf(tx)).toBe(9500n);
  });

  it('applies a custom slippageTolerance', async () => {
    const tx = await buildSellOptionRawTx({ ...base, slippageTolerance: 10n });
    // 10000 * 90 / 100 = 9000
    expect(minOutOf(tx)).toBe(9000n);
  });

  it('honors an explicit minAmountOut (opt-out) over the quote', async () => {
    const tx = await buildSellOptionRawTx({ ...base, minAmountOut: 1234n });
    expect(minOutOf(tx)).toBe(1234n);
  });

  it('explicit minAmountOut: 0n is respected (full opt-out)', async () => {
    const tx = await buildSellOptionRawTx({ ...base, minAmountOut: 0n });
    expect(minOutOf(tx)).toBe(0n);
  });
});
