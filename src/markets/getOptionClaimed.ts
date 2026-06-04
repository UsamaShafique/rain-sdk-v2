import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';

export interface GetOptionClaimedParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    userAddress: `0x${string}`;
    rpcUrl: string;
}

export async function getOptionClaimed(
    params: GetOptionClaimedParams
): Promise<boolean> {
    const { marketContractAddress, option, userAddress, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const claimed = await client.readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'optionClaimed',
        args: [option, userAddress],
    });

    return claimed as boolean;
}
