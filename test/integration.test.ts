import { describe, it, expect } from 'vitest';
import { checkMarketTokenAllowance, isRpcValid } from '../src/utils/helpers.js';

/**
 * Arbitrum integration test — exercises the viem-ported on-chain read path
 * (checkMarketTokenAllowance / isRpcValid) against a real deployed market.
 *
 * Gated behind RUN_INTEGRATION so the default unit suite stays offline and fast.
 * Run with: `npm run test:integration`. Point RPC_URL at an anvil fork of
 * Arbitrum for a hermetic fork test, or leave it on the public RPC.
 */
const RUN = !!process.env.RUN_INTEGRATION;
const RPC_URL = process.env.RPC_URL || 'https://arb1.arbitrum.io/rpc';

// A live market on the dev environment (status: Live).
const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const OWNER = '0x996ea23940f4a01610181d04bdb6f862719b63f0' as `0x${string}`;

describe.runIf(RUN)('Arbitrum integration (viem port)', () => {
  it('isRpcValid returns true for a reachable RPC', async () => {
    expect(await isRpcValid(RPC_URL)).toBe(true);
  }, 30_000);

  it('isRpcValid returns false for a bad RPC', async () => {
    expect(await isRpcValid('http://127.0.0.1:1')).toBe(false);
  }, 30_000);

  it('checkMarketTokenAllowance reads baseToken, allowance and decimals on-chain', async () => {
    const res = await checkMarketTokenAllowance({ marketContractAddress: MARKET, owner: OWNER, rpcUrl: RPC_URL });
    expect(res.baseToken).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(typeof res.allowance).toBe('bigint');
    expect(res.decimals).toBeGreaterThan(0);
  }, 30_000);
});
