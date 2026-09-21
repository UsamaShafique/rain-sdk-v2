import { encodeFunctionData } from "viem";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { SellOptionTxParams, RawTransaction } from "./types.js";
import { SELL_OPTION } from "../constants/contractmethods.js";
import { assertOption, assertSlippage, assertDeadline } from "./validation.js";
import { getSellProceeds } from "../markets/getSellProceeds.js";

const DEFAULT_SLIPPAGE = 5n; // 5%
const DEFAULT_DEADLINE_DURATION = 600; // 10 minutes

export async function buildSellOptionRawTx(
    params: SellOptionTxParams & { rpcUrl: string }
): Promise<RawTransaction> {
    const { marketContractAddress, selectedOption, optionSide, sharesAmount, minAmountOut, slippageTolerance, deadline, rpcUrl } = params;
    const effectiveDeadline = deadline ?? BigInt(Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_DURATION);

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (selectedOption === undefined || selectedOption === null) throw new Error("selectedOption is required");
    if (optionSide === undefined || optionSide === null) throw new Error("optionSide is required");
    if (!sharesAmount) throw new Error("sharesAmount is required");
    if (sharesAmount <= 0n) throw new Error("sharesAmount must be greater than 0");
    assertOption(selectedOption, "selectedOption");
    assertSlippage(slippageTolerance);
    assertDeadline(deadline);

    // Slippage protection: when the caller does not pin minAmountOut, quote the
    // expected proceeds on-chain (getSellProceeds — a conservative quote) and
    // apply the slippage tolerance. Pass minAmountOut: 0n to opt out explicitly.
    let effectiveMinAmountOut = minAmountOut;
    if (effectiveMinAmountOut === undefined || effectiveMinAmountOut === null) {
        const { proceeds } = await getSellProceeds({
            marketContractAddress,
            option: selectedOption,
            optionSide,
            shares: sharesAmount,
            rpcUrl,
        });
        const slippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
        effectiveMinAmountOut = proceeds * (100n - slippage) / 100n;
    }

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: SELL_OPTION,
            args: [selectedOption, optionSide, sharesAmount, effectiveMinAmountOut, effectiveDeadline],
        }),
        value: 0n,
    };
}
