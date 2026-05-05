import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { PLACE_BUY_ORDER, PLACE_SELL_ORDER } from "../constants/contractmethods.js";
export function buildPlaceBuyOrderRawTx(params) {
    const { marketContractAddress, option, optionSide, price, amount } = params;
    if (!marketContractAddress)
        throw new Error("marketContractAddress is required");
    if (option === undefined || option === null)
        throw new Error("option is required");
    if (optionSide === undefined || optionSide === null)
        throw new Error("optionSide is required");
    if (!price || price <= 0n)
        throw new Error("price must be greater than 0");
    if (!amount || amount <= 0n)
        throw new Error("amount must be greater than 0");
    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: PLACE_BUY_ORDER,
            args: [option, optionSide, price, amount],
        }),
        value: 0n,
    };
}
export function buildPlaceSellOrderRawTx(params) {
    const { marketContractAddress, option, optionSide, price, shares } = params;
    if (!marketContractAddress)
        throw new Error("marketContractAddress is required");
    if (option === undefined || option === null)
        throw new Error("option is required");
    if (optionSide === undefined || optionSide === null)
        throw new Error("optionSide is required");
    if (!price || price <= 0n)
        throw new Error("price must be greater than 0");
    if (!shares || shares <= 0n)
        throw new Error("shares must be greater than 0");
    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: PLACE_SELL_ORDER,
            args: [option, optionSide, price, shares],
        }),
        value: 0n,
    };
}
