import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { SellOptionTxParams, RawTransaction } from "./types.js";
import { SELL_OPTION } from "../constants/contractmethods.js";

const DEFAULT_DEADLINE_DURATION = 600; // 10 minutes

export function buildSellOptionRawTx(
    params: SellOptionTxParams
): RawTransaction {
    const { marketContractAddress, selectedOption, optionSide, sharesAmount, minAmountOut, deadline } = params;
    const effectiveDeadline = deadline ?? BigInt(Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_DURATION);

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (selectedOption === undefined || selectedOption === null) throw new Error("selectedOption is required");
    if (optionSide === undefined || optionSide === null) throw new Error("optionSide is required");
    if (!sharesAmount) throw new Error("sharesAmount is required");
    if (sharesAmount <= 0n) throw new Error("sharesAmount must be greater than 0");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: SELL_OPTION,
            args: [selectedOption, optionSide, sharesAmount, minAmountOut ?? 0n, effectiveDeadline],
        }),
        value: 0n,
    };
}
