import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';
export async function getUserOptionShares(params) {
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
    return shares;
}
