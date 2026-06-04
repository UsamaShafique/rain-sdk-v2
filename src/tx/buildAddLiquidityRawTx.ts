import { encodeFunctionData, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { AddLiquidityTxParams, RawTransaction } from "./types.js";
import { ENTER_LIQUIDITY } from "../constants/contractmethods.js";
import { checkMarketTokenAllowance } from "../utils/helpers.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

const DEFAULT_SLIPPAGE = 5n; // 5%
const DEFAULT_DEADLINE_SECONDS = 600n; // 10 minutes

export async function buildAddLiquidityRawTx(
    params: AddLiquidityTxParams & { walletAddress: `0x${string}`; rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, option, totalAmountInWei, minYesToDeposit, minNoToDeposit, slippageTolerance, deadline, walletAddress, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!totalAmountInWei) throw new Error("totalAmountInWei is required");
    if (totalAmountInWei <= 0n) throw new Error("totalAmountInWei must be greater than 0");

    const { allowance, baseToken } = await checkMarketTokenAllowance({ marketContractAddress, owner: walletAddress, rpcUrl });

    const txs: RawTransaction[] = [];

    if (allowance < totalAmountInWei) {
        txs.push(buildApproveRawTx({ tokenAddress: baseToken, spender: marketContractAddress, amount: totalAmountInWei }));
    }

    let effectiveMinYes = minYesToDeposit;
    let effectiveMinNo = minNoToDeposit;
    if ((effectiveMinYes === undefined || effectiveMinYes === null) && (effectiveMinNo === undefined || effectiveMinNo === null)) {
        const client = createPublicClient({
            chain: arbitrum,
            transport: http(rpcUrl),
        });

        const [yesReserve, noReserve] = await Promise.all([
            client.readContract({ address: marketContractAddress, abi: MarketsAbi, functionName: "ammYesReserve", args: [option] }),
            client.readContract({ address: marketContractAddress, abi: MarketsAbi, functionName: "ammNoReserve", args: [option] }),
        ]) as [bigint, bigint];

        const totalReserves = yesReserve + noReserve;
        if (totalReserves > 0n) {
            const expectedYes = totalAmountInWei * yesReserve / totalReserves;
            const expectedNo = totalAmountInWei * noReserve / totalReserves;
            const slippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
            effectiveMinYes = expectedYes * (100n - slippage) / 100n;
            effectiveMinNo = expectedNo * (100n - slippage) / 100n;
        }
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: ENTER_LIQUIDITY,
            args: [option, totalAmountInWei, effectiveMinYes ?? 0n, effectiveMinNo ?? 0n, deadline ?? DEFAULT_DEADLINE_SECONDS],
        }),
        value: 0n,
    });

    return txs;
}
