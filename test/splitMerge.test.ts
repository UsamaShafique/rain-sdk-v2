import { describe, it, expect } from 'vitest';
import { decodeFunctionData } from 'viem';
import { buildMergeRawTx } from '../src/tx/buildMergeRawTx.js';
import { buildSplitRawTx } from '../src/tx/buildSplitRawTx.js';
import { MarketsAbi } from '../src/abi/MarketsAbi.js';
import { RainValidationError } from '../src/tx/validation.js';

const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const WALLET = '0x996ea23940f4a01610181d04bdb6f862719b63f0' as `0x${string}`;

describe('buildMergeRawTx (sync) option guard', () => {
  it('rejects option 0 (1-based)', () => {
    expect(() => buildMergeRawTx({ marketContractAddress: MARKET, option: 0n, amount: 100n })).toThrow(RainValidationError);
  });

  it('encodes a merge for a valid option', () => {
    const tx = buildMergeRawTx({ marketContractAddress: MARKET, option: 1n, amount: 100n });
    const decoded = decodeFunctionData({ abi: MarketsAbi, data: tx.data });
    expect(decoded.functionName).toBe('merge');
    expect(decoded.args?.[0]).toBe(1n);
  });
});

describe('buildSplitRawTx (async) option guard', () => {
  it('rejects option 0 before any network call', async () => {
    await expect(buildSplitRawTx({
      marketContractAddress: MARKET, option: 0n, amount: 100n, walletAddress: WALLET, rpcUrl: 'http://127.0.0.1:1',
    })).rejects.toThrow(RainValidationError);
  });
});
