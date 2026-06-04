import { encodeFunctionData, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { RemoveLiquidityTxParams, RawTransaction } from "./types.js";
import { REMOVE_LIQUIDITY } from "../constants/contractmethods.js";

const DEFAULT_SLIPPAGE = 5n; // 5%
const DEFAULT_DEADLINE_SECONDS = 600n; // 10 minutes

export async function buildRemoveLiquidityRawTx(
    params: RemoveLiquidityTxParams & { rpcUrl: string }
): Promise<RawTransaction> {
    const { marketContractAddress, option, lpShares, minYesOut, minNoOut, slippageTolerance, deadline, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!lpShares) throw new Error("lpShares is required");
    if (lpShares <= 0n) throw new Error("lpShares must be greater than 0");

    let effectiveMinYes = minYesOut;
    let effectiveMinNo = minNoOut;
    if ((effectiveMinYes === undefined || effectiveMinYes === null) && (effectiveMinNo === undefined || effectiveMinNo === null)) {
        const client = createPublicClient({
            chain: arbitrum,
            transport: http(rpcUrl),
        });

        const [yesBack, noBack] = await client.readContract({
            address: marketContractAddress,
            abi: MarketsAbi,
            functionName: "getRemovedLiquidity",
            args: [option, lpShares],
        }) as [bigint, bigint];

        const slippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
        effectiveMinYes = yesBack * (100n - slippage) / 100n;
        effectiveMinNo = noBack * (100n - slippage) / 100n;
    }

    return {
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: REMOVE_LIQUIDITY,
            args: [option, lpShares, effectiveMinYes ?? 0n, effectiveMinNo ?? 0n, deadline ?? DEFAULT_DEADLINE_SECONDS],
        }),
        value: 0n,
    };
}
