import { describe, it, expect } from 'vitest';
import { decodeFunctionData } from 'viem';
import { buildSellOptionRawTx } from '../src/tx/buildSellOptionRawTx.js';
import { buildApproveRawTx } from '../src/tx/buildApprovalRawTx.js';
import { MarketsAbi } from '../src/abi/MarketsAbi.js';
import { ERC20Abi } from '../src/abi/ERC20Abi.js';
import { RainValidationError } from '../src/tx/validation.js';
import { Rain } from '../src/Rain.js';

const MARKET = '0x5921a9201ca251e9596ede57b67125d5c42c6077' as `0x${string}`;
const SPENDER = '0x0000000000000000000000000000000000000001' as `0x${string}`;
const TOKEN = '0x0000000000000000000000000000000000000002' as `0x${string}`;
const FUTURE = BigInt(Math.floor(Date.now() / 1000) + 600);

describe('buildSellOptionRawTx', () => {
  it('encodes a sellOption call with an explicit minAmountOut (no network)', async () => {
    const tx = await buildSellOptionRawTx({
      marketContractAddress: MARKET,
      selectedOption: 1n,
      optionSide: 1,
      sharesAmount: 1000n,
      minAmountOut: 250n, // explicit — opt out of the on-chain quote
      deadline: FUTURE,
      rpcUrl: 'http://127.0.0.1:1', // must NOT be hit when minAmountOut is set
    });
    expect(tx.to).toBe(MARKET);
    expect(tx.value).toBe(0n);
    const decoded = decodeFunctionData({ abi: MarketsAbi, data: tx.data });
    expect(decoded.functionName).toBe('sellOption');
    expect(decoded.args?.[0]).toBe(1n); // option
    expect(decoded.args?.[2]).toBe(1000n); // shares
    expect(decoded.args?.[3]).toBe(250n); // minAmountOut passed through unchanged
  });

  it('rejects a 0 option (1-based) before any network call', async () => {
    await expect(buildSellOptionRawTx({
      marketContractAddress: MARKET, selectedOption: 0n, optionSide: 1, sharesAmount: 1000n, deadline: FUTURE, rpcUrl: 'http://127.0.0.1:1',
    })).rejects.toThrow(RainValidationError);
  });

  it('rejects a duration-style deadline before any network call', async () => {
    await expect(buildSellOptionRawTx({
      marketContractAddress: MARKET, selectedOption: 1n, optionSide: 1, sharesAmount: 1000n, deadline: 600n, rpcUrl: 'http://127.0.0.1:1',
    })).rejects.toThrow(/deadline/);
  });

  it('rejects slippageTolerance > 100 before any network call', async () => {
    await expect(buildSellOptionRawTx({
      marketContractAddress: MARKET, selectedOption: 1n, optionSide: 1, sharesAmount: 1000n, slippageTolerance: 500n, deadline: FUTURE, rpcUrl: 'http://127.0.0.1:1',
    })).rejects.toThrow(/slippageTolerance/);
  });
});

describe('buildApproveRawTx', () => {
  it('encodes an ERC20 approve with exact amount', () => {
    const tx = buildApproveRawTx({ tokenAddress: TOKEN, spender: SPENDER, amount: 5_000_000n });
    expect(tx.to).toBe(TOKEN);
    const decoded = decodeFunctionData({ abi: ERC20Abi, data: tx.data });
    expect(decoded.functionName).toBe('approve');
    expect(decoded.args?.[0]).toBe(SPENDER);
    expect(decoded.args?.[1]).toBe(5_000_000n);
  });

  it('rejects infinite/zero approvals', () => {
    expect(() => buildApproveRawTx({ tokenAddress: TOKEN, spender: SPENDER, amount: 0n })).toThrow();
  });
});

describe('Rain.parseAmount / formatAmount', () => {
  const rain = new Rain({ environment: 'development' });
  const usdt = rain.getEnvironmentConfig().tokens.usdt.address;
  const rainToken = rain.getEnvironmentConfig().tokens.rain.address;

  it('parses using the token decimals (USDT = 6)', () => {
    expect(rain.parseAmount('5', usdt)).toBe(5_000_000n);
  });

  it('parses using the token decimals (RAIN = 18)', () => {
    expect(rain.parseAmount('1', rainToken)).toBe(1_000_000_000_000_000_000n);
  });

  it('round-trips format(parse(x)) === x', () => {
    expect(rain.formatAmount(rain.parseAmount('12.5', usdt), usdt)).toBe('12.5');
  });

  it('throws for an unknown token', () => {
    expect(() => rain.parseAmount('1', '0x0000000000000000000000000000000000000000')).toThrow(/Unknown token/);
  });
});
