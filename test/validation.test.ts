import { describe, it, expect } from 'vitest';
import { assertDeadline, assertSlippage, assertOption, RainValidationError } from '../src/tx/validation.js';

describe('assertDeadline', () => {
  it('accepts undefined/null (optional)', () => {
    expect(() => assertDeadline(undefined)).not.toThrow();
    expect(() => assertDeadline(null)).not.toThrow();
  });

  it('rejects a duration-looking value (< 1e9)', () => {
    expect(() => assertDeadline(600n)).toThrow(RainValidationError);
    expect(() => assertDeadline(600n)).toThrow(/looks like a duration/);
  });

  it('rejects an already-expired absolute timestamp', () => {
    expect(() => assertDeadline(1_000_000_001n)).toThrow(/already in the past/);
  });

  it('accepts a valid future absolute timestamp', () => {
    const future = BigInt(Math.floor(Date.now() / 1000) + 600);
    expect(() => assertDeadline(future)).not.toThrow();
  });
});

describe('assertSlippage', () => {
  it('accepts undefined and the 0..100 range', () => {
    expect(() => assertSlippage(undefined)).not.toThrow();
    expect(() => assertSlippage(0n)).not.toThrow();
    expect(() => assertSlippage(5n)).not.toThrow();
    expect(() => assertSlippage(100n)).not.toThrow();
  });

  it('rejects values above 100 (bps mistake)', () => {
    expect(() => assertSlippage(500n)).toThrow(RainValidationError);
    expect(() => assertSlippage(500n)).toThrow(/between 0 and 100/);
  });

  it('rejects negative values', () => {
    expect(() => assertSlippage(-1n)).toThrow(RainValidationError);
  });
});

describe('assertOption', () => {
  it('accepts undefined and any value >= 1', () => {
    expect(() => assertOption(undefined)).not.toThrow();
    expect(() => assertOption(1n)).not.toThrow();
    expect(() => assertOption(26n)).not.toThrow();
  });

  it('rejects 0 (options are 1-based)', () => {
    expect(() => assertOption(0n)).toThrow(RainValidationError);
    expect(() => assertOption(0n, 'selectedOption')).toThrow(/1-based/);
  });

  it('rejects negative values', () => {
    expect(() => assertOption(-1n)).toThrow(RainValidationError);
  });
});
