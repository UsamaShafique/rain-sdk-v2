import { RawTransaction } from "./types.js";

/**
 * Pluggable executor for sending the raw transactions the builders produce.
 * Adapt it to viem, ethers, RainAA, or your own KMS — the SDK stays key-agnostic.
 *
 * @example viem
 * const executor = {
 *   send: (tx) => walletClient.sendTransaction({ to: tx.to, data: tx.data, value: tx.value ?? 0n }),
 *   wait: (hash) => publicClient.waitForTransactionReceipt({ hash }),
 * };
 *
 * @example RainAA (session key)
 * const executor = { send: (tx) => rainAA.sendTransaction(tx) };
 */
export interface TxExecutor {
    /** Broadcast one transaction and resolve with its hash. */
    send: (tx: RawTransaction) => Promise<`0x${string}`>;
    /** Optional: wait for a hash to be mined before the next send. Strongly recommended for approval→main sequences. */
    wait?: (hash: `0x${string}`) => Promise<unknown>;
}

/**
 * Sequences an ordered list of raw transactions through an executor, awaiting
 * each receipt (when `wait` is provided) before sending the next. This is the
 * correct way to handle the `[approval, main]` arrays the builders return —
 * sending the main tx before the approval lands is the most common integration
 * bug.
 *
 * @returns the transaction hashes, in order.
 */
export async function executeTxs(
    txs: RawTransaction[],
    executor: TxExecutor
): Promise<`0x${string}`[]> {
    if (!txs || txs.length === 0) return [];
    if (typeof executor?.send !== 'function') {
        throw new Error("executor.send is required");
    }

    const hashes: `0x${string}`[] = [];
    for (const tx of txs) {
        const hash = await executor.send(tx);
        hashes.push(hash);
        if (executor.wait) {
            await executor.wait(hash);
        }
    }
    return hashes;
}
