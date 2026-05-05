import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { ClaimTxParams, RawTransaction } from "./types.js";
import { CLAIM } from "../constants/contractmethods.js";

export function buildClaimRawTx(params: ClaimTxParams): RawTransaction {
    const { marketContractAddress, option } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CLAIM,
            args: [option],
        }),
        value: 0n,
    };
}
