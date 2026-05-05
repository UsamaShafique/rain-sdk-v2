import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { AddLiquidityTxParams, RawTransaction } from "./types.js";
import { ENTER_LIQUIDITY } from "../constants/contractmethods.js";

export function buildAddLiquidityRawTx(
    params: AddLiquidityTxParams
): RawTransaction {
    const { marketContractAddress, option, totalAmountInWei } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!totalAmountInWei) throw new Error("totalAmountInWei is required");
    if (totalAmountInWei <= 0n) throw new Error("totalAmountInWei must be greater than 0");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: ENTER_LIQUIDITY,
            args: [option, totalAmountInWei],
        }),
        value: 0n,
    };
}
