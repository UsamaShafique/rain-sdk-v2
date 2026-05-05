import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';

export interface GetUserOptionSharesParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number; // 1 = Yes, 2 = No
    userAddress: `0x${string}`;
    rpcUrl: string;
}

export async function getUserOptionShares(
    params: GetUserOptionSharesParams
): Promise<bigint> {
    const { marketContractAddress, option, optionSide, userAddress, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const shares = await client.readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'userOptionPerSideShares',
        args: [option, optionSide, userAddress],
    });

    return shares as bigint;
}
