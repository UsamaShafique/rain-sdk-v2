import { RawTransaction } from "./types.js";
export interface CalculateWinnerTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
}
/**
 * Builds calculateWinner TX.
 * 1. Reads optionResolver(option) from market contract to get the resolver address for that option
 * 2. Encodes calculateWinner() call to that resolver
 */
export declare function buildCalculateWinnerRawTx(params: CalculateWinnerTxParams & {
    rpcUrl: string;
}): Promise<RawTransaction>;
