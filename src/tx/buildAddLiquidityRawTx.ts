import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { AddLiquidityTxParams, RawTransaction } from "./types.js";
import { ENTER_LIQUIDITY } from "../constants/contractmethods.js";
import { checkMarketTokenAllowance } from "../utils/helpers.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

export async function buildAddLiquidityRawTx(
    params: AddLiquidityTxParams & { walletAddress: `0x${string}`; rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, option, totalAmountInWei, walletAddress, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!totalAmountInWei) throw new Error("totalAmountInWei is required");
    if (totalAmountInWei <= 0n) throw new Error("totalAmountInWei must be greater than 0");

    const { allowance, baseToken } = await checkMarketTokenAllowance({ marketContractAddress, owner: walletAddress, rpcUrl });

    const txs: RawTransaction[] = [];

    if (allowance < totalAmountInWei) {
        txs.push(buildApproveRawTx({ tokenAddress: baseToken, spender: marketContractAddress, amount: totalAmountInWei }));
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: ENTER_LIQUIDITY,
            args: [option, totalAmountInWei],
        }),
        value: 0n,
    });

    return txs;
}
