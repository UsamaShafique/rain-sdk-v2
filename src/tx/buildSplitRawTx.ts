import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { SplitTxParams, RawTransaction } from "./types.js";
import { SPLIT } from "../constants/contractmethods.js";
import { checkMarketTokenAllowance } from "../utils/helpers.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

export async function buildSplitRawTx(
    params: SplitTxParams & { walletAddress: `0x${string}`; rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, option, amount, walletAddress, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!amount || amount <= 0n) throw new Error("amount must be greater than 0");

    const { allowance, baseToken } = await checkMarketTokenAllowance({ marketContractAddress, owner: walletAddress, rpcUrl });

    const txs: RawTransaction[] = [];

    if (allowance < amount) {
        txs.push(buildApproveRawTx({ tokenAddress: baseToken, spender: marketContractAddress, amount }));
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: SPLIT,
            args: [option, amount],
        }),
        value: 0n,
    });

    return txs;
}
