import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { MergeTxParams, RawTransaction } from "./types.js";
import { MERGE } from "../constants/contractmethods.js";

export function buildMergeRawTx(params: MergeTxParams): RawTransaction {
    const { marketContractAddress, option, amount } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!amount || amount <= 0n) throw new Error("amount must be greater than 0");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: MERGE,
            args: [option, amount],
        }),
        value: 0n,
    };
}
