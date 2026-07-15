import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const sellProceedsAbi = parseAbi([
    'function getSellProceeds(uint256 option, uint8 optionSide, uint256 shares) view returns (uint256 proceeds, uint256 sharesSold)',
]);

export interface SellProceedsResult {
    proceeds: bigint;
    sharesSold: bigint;
}

export async function getSellProceeds(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    shares: bigint;
    rpcUrl: string;
}): Promise<SellProceedsResult> {
    const { marketContractAddress, option, optionSide, shares, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const [proceeds, sharesSold] = await client.readContract({
        address: marketContractAddress,
        abi: sellProceedsAbi,
        functionName: 'getSellProceeds',
        args: [option, optionSide, shares],
    });

    return { proceeds, sharesSold };
}
