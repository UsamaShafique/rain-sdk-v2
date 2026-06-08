import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';

export interface GetDisputeWindowParams {
    marketContractAddress: `0x${string}`;
    rpcUrl: string;
}

export async function getDisputeWindow(
    params: GetDisputeWindowParams
): Promise<bigint> {
    const { marketContractAddress, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const disputeWindow = await client.readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'DISPUTE_WINDOW',
    });

    return disputeWindow as bigint;
}
