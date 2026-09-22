import { describe, it, expect } from 'vitest';
import { buildApproveRawTx } from '../src/tx/buildApprovalRawTx.js';
import { buildMergeRawTx } from '../src/tx/buildMergeRawTx.js';
import { buildClaimRawTx } from '../src/tx/buildClaimRawTx.js';
import { buildChooseWinnerRawTx } from '../src/tx/buildClosePoolRawTx.js';
import { buildPlaceSellOrderRawTx } from '../src/tx/buildPlaceOrderRawTx.js';
import { buildCancelBuyOrdersRawTx, buildCancelSellOrdersRawTx } from '../src/tx/buildCancelOrdersRawTx.js';

// Calldata snapshots for the pure (no-network) transaction builders. FIXED inputs →
// stable `RawTransaction` output. Any unintended ABI change or param-order swap breaks
// a snapshot. NOTE: the committed snapshots were human-verified once (decoded via viem);
// do not bless a changed snapshot without re-verifying the calldata.
const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const TOKEN = '0xCa4f77A38d8552Dd1D5E44e890173921B67725F4' as `0x${string}`;
const SPENDER = '0x0000000000000000000000000000000000000abc' as `0x${string}`;

describe('calldata snapshots — pure builders', () => {
  it('buildApproveRawTx', () => {
    expect(buildApproveRawTx({ tokenAddress: TOKEN, spender: SPENDER, amount: 5_000_000n })).toMatchSnapshot();
  });

  it('buildMergeRawTx', () => {
    expect(buildMergeRawTx({ marketContractAddress: MARKET, option: 1n, amount: 1_000_000n })).toMatchSnapshot();
  });

  it('buildClaimRawTx', () => {
    expect(buildClaimRawTx({ marketContractAddress: MARKET, option: 2n })).toMatchSnapshot();
  });

  it('buildChooseWinnerRawTx', () => {
    expect(buildChooseWinnerRawTx({ marketContractAddress: MARKET, option: 1n, optionSide: 1 })).toMatchSnapshot();
  });

  it('buildPlaceSellOrderRawTx', () => {
    expect(buildPlaceSellOrderRawTx({ marketContractAddress: MARKET, option: 1n, optionSide: 1, price: 500000000000000000n, shares: 1000n })).toMatchSnapshot();
  });

  it('buildCancelBuyOrdersRawTx', () => {
    expect(buildCancelBuyOrdersRawTx({ marketContractAddress: MARKET, option: 1n, optionSides: [1], prices: [500000000000000000n], orderIDs: [7n] })).toMatchSnapshot();
  });

  it('buildCancelSellOrdersRawTx', () => {
    expect(buildCancelSellOrdersRawTx({ marketContractAddress: MARKET, option: 1n, optionSides: [2], prices: [400000000000000000n], orderIDs: [9n] })).toMatchSnapshot();
  });
});
