import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the on-chain reads so the slippage/approval logic is deterministic and offline.
// createPublicClient is replaced with a fake whose readContract returns canned values
// by function name; encodeFunctionData/decodeFunctionData stay real.
vi.mock('viem', async (importOriginal) => {
  const actual = await importOriginal<typeof import('viem')>();
  return {
    ...actual,
    createPublicClient: () => ({
      readContract: async ({ functionName }: { functionName: string }) => {
        switch (functionName) {
          case 'getEntryShares': return [1000n, 0n];      // [expectedShares, expectedReward]
          case 'ammYesReserve': return 600n;
          case 'ammNoReserve': return 400n;
          case 'getRemovedLiquidity': return [300n, 200n]; // [yesBack, noBack]
          default: return 0n;
        }
      },
    }),
  };
});

// Allowance check is mocked per-test to drive approval-inclusion behavior.
vi.mock('../src/utils/helpers.js', () => ({ checkMarketTokenAllowance: vi.fn() }));

import { decodeFunctionData } from 'viem';
import { MarketsAbi } from '../src/abi/MarketsAbi.js';
import { checkMarketTokenAllowance } from '../src/utils/helpers.js';
import { buildEnterOptionRawTx } from '../src/tx/buildEnterOptionRawTx.js';
import { buildAddLiquidityRawTx } from '../src/tx/buildAddLiquidityRawTx.js';
import { buildRemoveLiquidityRawTx } from '../src/tx/buildRemoveLiquidityRawTx.js';

const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const WALLET = '0x996ea23940f4a01610181d04bdb6f862719b63f0' as `0x${string}`;
const TOKEN = '0xCa4f77A38d8552Dd1D5E44e890173921B67725F4' as `0x${string}`;
const RPC = 'http://127.0.0.1:1';
const mockedAllowance = vi.mocked(checkMarketTokenAllowance);

function decodeMain(txs: { data: `0x${string}` }[] | { data: `0x${string}` }) {
  const tx = Array.isArray(txs) ? txs[txs.length - 1] : txs;
  return decodeFunctionData({ abi: MarketsAbi, data: tx.data });
}

beforeEach(() => {
  mockedAllowance.mockResolvedValue({ allowance: 0n, baseToken: TOKEN, decimals: 6 });
});

describe('buildEnterOptionRawTx — slippage + approval', () => {
  const base = { marketContractAddress: MARKET, selectedOption: 1n, optionSide: 1 as const, buyAmountInWei: 100n, walletAddress: WALLET, rpcUrl: RPC };

  it('derives minSharesOut from getEntryShares with default 5%', async () => {
    const txs = await buildEnterOptionRawTx({ ...base });
    // expectedShares 1000 * (100-5)/100 = 950
    expect(decodeMain(txs).args?.[3]).toBe(950n);
  });

  it('applies a custom slippageTolerance', async () => {
    const txs = await buildEnterOptionRawTx({ ...base, slippageTolerance: 10n });
    expect(decodeMain(txs).args?.[3]).toBe(900n);
  });

  it('includes an approval tx when allowance is insufficient', async () => {
    mockedAllowance.mockResolvedValue({ allowance: 0n, baseToken: TOKEN, decimals: 6 });
    const txs = await buildEnterOptionRawTx({ ...base });
    expect(txs).toHaveLength(2); // [approval, enterOption]
  });

  it('omits the approval tx when allowance already covers it', async () => {
    mockedAllowance.mockResolvedValue({ allowance: 1_000n, baseToken: TOKEN, decimals: 6 });
    const txs = await buildEnterOptionRawTx({ ...base });
    expect(txs).toHaveLength(1); // [enterOption]
  });
});

describe('buildAddLiquidityRawTx — reserve-proportional minimums', () => {
  const base = { marketContractAddress: MARKET, option: 1n, totalAmountInWei: 100n, walletAddress: WALLET, rpcUrl: RPC };

  it('splits by AMM reserves and applies default 5% floor', async () => {
    const txs = await buildAddLiquidityRawTx({ ...base });
    // reserves 600/400 of 1000 → yes 60, no 40 → *0.95 → 57 / 38
    const args = decodeMain(txs).args;
    expect(args?.[2]).toBe(57n);
    expect(args?.[3]).toBe(38n);
  });

  it('omits approval when allowance covers the deposit', async () => {
    mockedAllowance.mockResolvedValue({ allowance: 1_000n, baseToken: TOKEN, decimals: 6 });
    const txs = await buildAddLiquidityRawTx({ ...base });
    expect(txs).toHaveLength(1);
  });
});

describe('buildRemoveLiquidityRawTx — getRemovedLiquidity minimums', () => {
  it('applies default 5% floor to returned amounts', async () => {
    const tx = await buildRemoveLiquidityRawTx({ marketContractAddress: MARKET, option: 1n, lpShares: 500n, rpcUrl: RPC });
    // getRemovedLiquidity [300,200] → *0.95 → 285 / 190
    const args = decodeMain(tx).args;
    expect(args?.[2]).toBe(285n);
    expect(args?.[3]).toBe(190n);
  });

  it('applies a custom slippageTolerance', async () => {
    const tx = await buildRemoveLiquidityRawTx({ marketContractAddress: MARKET, option: 1n, lpShares: 500n, slippageTolerance: 20n, rpcUrl: RPC });
    const args = decodeMain(tx).args;
    expect(args?.[2]).toBe(240n); // 300*0.8
    expect(args?.[3]).toBe(160n); // 200*0.8
  });
});
