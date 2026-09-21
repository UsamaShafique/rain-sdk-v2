/**
 * Synchronous, build-time parameter guards shared across the transaction
 * builders. These convert documented footguns (durations passed as deadlines,
 * slippage in the wrong unit, 0-based option indices) into immediate, descriptive
 * errors — before any encoding or broadcast.
 */

export class RainValidationError extends Error {
    constructor(public readonly field: string, message: string) {
        super(`Invalid ${field}: ${message}`);
        this.name = 'RainValidationError';
    }
}

// Any value below this looks like a duration (seconds) rather than an absolute
// unix timestamp. 1_000_000_000 = 2001-09-09; any real deadline is far larger.
const MIN_PLAUSIBLE_TIMESTAMP = 1_000_000_000n;

/** Deadlines are absolute unix timestamps (seconds), not durations. Optional — skipped when omitted. */
export function assertDeadline(deadline?: bigint | null): void {
    if (deadline === undefined || deadline === null) return;
    if (deadline < MIN_PLAUSIBLE_TIMESTAMP) {
        throw new RainValidationError(
            'deadline',
            `${deadline} looks like a duration; pass an absolute unix timestamp in seconds`
        );
    }
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (deadline <= now) {
        throw new RainValidationError('deadline', `${deadline} is already in the past`);
    }
}

/** slippageTolerance is a whole percent (e.g. 5 = 5%), not basis points. Optional — skipped when omitted. */
export function assertSlippage(slippageTolerance?: bigint | null): void {
    if (slippageTolerance === undefined || slippageTolerance === null) return;
    if (slippageTolerance < 0n || slippageTolerance > 100n) {
        throw new RainValidationError(
            'slippageTolerance',
            `${slippageTolerance} must be between 0 and 100 (whole percent, not basis points)`
        );
    }
}

/** Option indices are 1-based across the SDK (the first option is 1, never 0). */
export function assertOption(option: bigint | undefined | null, field = 'option'): void {
    if (option === undefined || option === null) return;
    if (option < 1n) {
        throw new RainValidationError(field, `${option} is invalid; options are 1-based (the first option is 1)`);
    }
}
