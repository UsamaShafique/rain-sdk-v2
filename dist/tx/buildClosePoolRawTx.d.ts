import { ClosePoolAITxParams, ClosePoolManualTxParams, ChooseWinnerTxParams, RawTransaction } from "./types.js";
/**
 * Close pool with AI resolver — no winner proposed, AI decides.
 * Returns [approval, closePool] transactions.
 */
export declare function buildClosePoolAIRawTx(params: ClosePoolAITxParams & {
    rpcUrl: string;
}): Promise<RawTransaction[]>;
/**
 * Close pool with manual resolver — proposer suggests a winning side.
 * Returns [approval, closePool] transactions.
 */
export declare function buildClosePoolManualRawTx(params: ClosePoolManualTxParams & {
    rpcUrl: string;
}): Promise<RawTransaction[]>;
/**
 * Choose/finalize the winner after pool is closed.
 * chooseWinner(option, optionSide)
 */
export declare function buildChooseWinnerRawTx(params: ChooseWinnerTxParams): RawTransaction;
