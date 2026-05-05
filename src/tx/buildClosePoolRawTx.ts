import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { ClosePoolAITxParams, ClosePoolManualTxParams, ChooseWinnerTxParams, RawTransaction } from "./types.js";
import { CLOSE_POOL, CHOOSE_WINNER } from "../constants/contractmethods.js";
import { getResolverBondAmount, getMarketBaseToken } from "../markets/getResolverBondAmount.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

/**
 * Close pool with AI resolver — no winner proposed, AI decides.
 * Returns [approval, closePool] transactions.
 */
export async function buildClosePoolAIRawTx(
    params: ClosePoolAITxParams & { rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, option, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");

    const [bondAmount, baseToken] = await Promise.all([
        getResolverBondAmount({ marketContractAddress, option, rpcUrl }),
        getMarketBaseToken({ marketContractAddress, rpcUrl }),
    ]);

    const txs: RawTransaction[] = [];

    if (bondAmount > 0n) {
        txs.push(buildApproveRawTx({
            tokenAddress: baseToken,
            spender: marketContractAddress,
            amount: bondAmount,
        }));
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CLOSE_POOL,
            args: [option],
        }),
        value: 0n,
    });

    return txs;
}

/**
 * Close pool with manual resolver — proposer suggests a winning side.
 * Returns [approval, closePool] transactions.
 */
export async function buildClosePoolManualRawTx(
    params: ClosePoolManualTxParams & { rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, option, proposedWinner, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (proposedWinner === undefined || proposedWinner === null) throw new Error("proposedWinner is required");

    const [bondAmount, baseToken] = await Promise.all([
        getResolverBondAmount({ marketContractAddress, option, rpcUrl }),
        getMarketBaseToken({ marketContractAddress, rpcUrl }),
    ]);

    const txs: RawTransaction[] = [];

    if (bondAmount > 0n) {
        txs.push(buildApproveRawTx({
            tokenAddress: baseToken,
            spender: marketContractAddress,
            amount: bondAmount,
        }));
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CLOSE_POOL,
            args: [option, proposedWinner],
        }),
        value: 0n,
    });

    return txs;
}

/**
 * Choose/finalize the winner after pool is closed.
 * chooseWinner(option, optionSide)
 */
export function buildChooseWinnerRawTx(params: ChooseWinnerTxParams): RawTransaction {
    const { marketContractAddress, option, optionSide } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (optionSide === undefined || optionSide === null) throw new Error("optionSide is required");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CHOOSE_WINNER,
            args: [option, optionSide],
        }),
        value: 0n,
    };
}
