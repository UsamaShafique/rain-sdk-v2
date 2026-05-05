import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { CancelBuyOrdersTxParams, CancelSellOrdersTxParams, RawTransaction } from "./types.js";
import { CANCEL_BUY_ORDERS, CANCEL_SELL_ORDERS } from "../constants/contractmethods.js";

export function buildCancelBuyOrdersRawTx(params: CancelBuyOrdersTxParams): RawTransaction {
    const { marketContractAddress, option, optionSides, prices, orderIDs } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!optionSides.length || !prices.length || !orderIDs.length) throw new Error("optionSides, prices, and orderIDs arrays are required");
    if (optionSides.length !== prices.length || prices.length !== orderIDs.length) throw new Error("optionSides, prices, and orderIDs must have the same length");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CANCEL_BUY_ORDERS,
            args: [option, optionSides, prices, orderIDs],
        }),
        value: 0n,
    };
}

export function buildCancelSellOrdersRawTx(params: CancelSellOrdersTxParams): RawTransaction {
    const { marketContractAddress, option, optionSides, prices, orderIDs } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!optionSides.length || !prices.length || !orderIDs.length) throw new Error("optionSides, prices, and orderIDs arrays are required");
    if (optionSides.length !== prices.length || prices.length !== orderIDs.length) throw new Error("optionSides, prices, and orderIDs must have the same length");

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: CANCEL_SELL_ORDERS,
            args: [option, optionSides, prices, orderIDs],
        }),
        value: 0n,
    };
}
