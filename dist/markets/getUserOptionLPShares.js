import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';
export async function getUserOptionLPShares(params) {
    const { marketContractAddress, option, userAddress, rpcUrl } = params;
    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });
    const shares = await client.readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'userOptionLPShares',
        args: [option, userAddress],
    });
    return shares;
}
