import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const dynamicPayoutAbi = parseAbi([
    'function getDynamicPayout(address user, uint256 option) view returns (uint256[] dynamicPayout)',
]);

export async function getDynamicPayout(params: {
    marketContractAddress: `0x${string}`;
    userAddress: `0x${string}`;
    option: bigint;
    rpcUrl: string;
}): Promise<bigint[]> {
    const { marketContractAddress, userAddress, option, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const payout = await client.readContract({
        address: marketContractAddress,
        abi: dynamicPayoutAbi,
        functionName: 'getDynamicPayout',
        args: [userAddress, option],
    });

    return payout as bigint[];
}
