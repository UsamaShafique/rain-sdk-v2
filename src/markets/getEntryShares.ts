import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';

export interface GetEntrySharesParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number; // 1 = Yes, 2 = No
    amount: bigint; // buy amount in base token wei
    rpcUrl: string;
}

export interface EntrySharesResult {
    returnedShares: bigint;
    expectedReward: bigint;
}

export async function getEntryShares(
    params: GetEntrySharesParams
): Promise<EntrySharesResult> {
    const { marketContractAddress, option, optionSide, amount, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const result = await client.readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'getEntryShares',
        args: [option, optionSide, amount],
    }) as [bigint, bigint];

    return {
        returnedShares: result[0],
        expectedReward: result[1],
    };
}
