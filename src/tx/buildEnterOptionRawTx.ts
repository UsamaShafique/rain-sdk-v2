import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { EnterOptionTxParams, RawTransaction } from "./types.js";
import { ENTER_OPTION } from "../constants/contractmethods.js";
import { checkMarketTokenAllowance } from "../utils/helpers.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

export async function buildEnterOptionRawTx(
    params: EnterOptionTxParams & { walletAddress: `0x${string}`; rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, selectedOption, optionSide, buyAmountInWei, walletAddress, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (selectedOption === undefined || selectedOption === null) throw new Error("selectedOption is required");
    if (optionSide === undefined || optionSide === null) throw new Error("optionSide is required");
    if (!buyAmountInWei) throw new Error("buyAmountInWei is required");
    if (buyAmountInWei <= 0n) throw new Error("buyAmountInWei must be greater than 0");

    const { allowance, baseToken } = await checkMarketTokenAllowance({ marketContractAddress, owner: walletAddress, rpcUrl });

    const txs: RawTransaction[] = [];

    if (allowance < buyAmountInWei) {
        txs.push(buildApproveRawTx({ tokenAddress: baseToken, spender: marketContractAddress, amount: buyAmountInWei }));
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: ENTER_OPTION,
            args: [selectedOption, optionSide, buyAmountInWei],
        }),
        value: 0n,
    });

    return txs;
}
