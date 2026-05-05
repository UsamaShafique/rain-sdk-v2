import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { OPEN_DISPUTE } from "../constants/contractmethods.js";
import { getDisputeAppealFee } from "../markets/getDisputeFee.js";
import { getMarketBaseToken } from "../markets/getResolverBondAmount.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";
/**
 * Build open dispute transactions.
 * Reads the dispute fee from the contract, builds approval + openDispute.
 */
export async function buildOpenDisputeRawTx(params) {
    const { marketContractAddress, option, rpcUrl } = params;
    if (!marketContractAddress)
        throw new Error("marketContractAddress is required");
    if (option === undefined || option === null)
        throw new Error("option is required");
    const [disputeFee, baseToken] = await Promise.all([
        getDisputeAppealFee({ marketContractAddress, option, rpcUrl }),
        getMarketBaseToken({ marketContractAddress, rpcUrl }),
    ]);
    const txs = [];
    if (disputeFee > 0n) {
        txs.push(buildApproveRawTx({
            tokenAddress: baseToken,
            spender: marketContractAddress,
            amount: disputeFee,
        }));
    }
    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: OPEN_DISPUTE,
            args: [option],
        }),
        value: 0n,
    });
    return txs;
}
