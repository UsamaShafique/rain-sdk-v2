import { encodeFunctionData, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { MarketsAbi } from "../abi/MarketsAbi.js";
import { EnterOptionTxParams, RawTransaction } from "./types.js";
import { ENTER_OPTION } from "../constants/contractmethods.js";
import { checkMarketTokenAllowance } from "../utils/helpers.js";
import { buildApproveRawTx } from "./buildApprovalRawTx.js";

const DEFAULT_SLIPPAGE = 5n; // 5%
const DEFAULT_DEADLINE_DURATION = 600; // 10 minutes

export async function buildEnterOptionRawTx(
    params: EnterOptionTxParams & { walletAddress: `0x${string}`; rpcUrl: string }
): Promise<RawTransaction[]> {
    const { marketContractAddress, selectedOption, optionSide, buyAmountInWei, minSharesOut, slippageTolerance, deadline, walletAddress, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (selectedOption === undefined || selectedOption === null) throw new Error("selectedOption is required");
    if (optionSide === undefined || optionSide === null) throw new Error("optionSide is required");
    if (!buyAmountInWei) throw new Error("buyAmountInWei is required");
    if (buyAmountInWei <= 0n) throw new Error("buyAmountInWei must be greater than 0");

    const { allowance, baseToken } = await checkMarketTokenAllowance({ marketContractAddress, owner: walletAddress, rpcUrl });

    const txs: RawTransaction[] = [];

    if (allowance < buyAmountInWei) {
        txs.push(buildApproveRawTx({ tokenAddress: baseToken, spender: marketContractAddress, amount: buyAmountInWei }));
    }

    let effectiveMinShares = minSharesOut;
    if (effectiveMinShares === undefined || effectiveMinShares === null) {
        const client = createPublicClient({
            chain: arbitrum,
            transport: http(rpcUrl),
        });

        const [expectedShares] = await client.readContract({
            address: marketContractAddress,
            abi: MarketsAbi,
            functionName: "getEntryShares",
            args: [selectedOption, optionSide, buyAmountInWei],
        }) as [bigint, bigint];

        const slippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
        effectiveMinShares = expectedShares * (100n - slippage) / 100n;
    }

    txs.push({
        to: marketContractAddress,
        data: encodeFunctionData({
            abi: MarketsAbi,
            functionName: ENTER_OPTION,
            args: [selectedOption, optionSide, buyAmountInWei, effectiveMinShares, deadline ?? BigInt(Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_DURATION)],
        }),
        value: 0n,
    });

    return txs;
}
