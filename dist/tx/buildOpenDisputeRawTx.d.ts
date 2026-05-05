import { OpenDisputeTxParams, RawTransaction } from "./types.js";
/**
 * Build open dispute transactions.
 * Reads the dispute fee from the contract, builds approval + openDispute.
 */
export declare function buildOpenDisputeRawTx(params: OpenDisputeTxParams & {
    rpcUrl: string;
}): Promise<RawTransaction[]>;
