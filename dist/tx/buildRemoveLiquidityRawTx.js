import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { REMOVE_LIQUIDITY } from "../constants/contractmethods.js";
export function buildRemoveLiquidityRawTx(params) {
    const { marketContractAddress, option, lpShares } = params;
    if (!marketContractAddress)
        throw new Error("marketContractAddress is required");
    if (option === undefined || option === null)
        throw new Error("option is required");
    if (!lpShares)
        throw new Error("lpShares is required");
    if (lpShares <= 0n)
        throw new Error("lpShares must be greater than 0");
    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: REMOVE_LIQUIDITY,
            args: [option, lpShares],
        }),
        value: 0n,
    };
}
