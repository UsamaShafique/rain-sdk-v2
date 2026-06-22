import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const claimableAmountAbi = parseAbi([
    'function getClaimableAmount(address user, uint256 option) view returns (uint256 totalClaimable)',
]);

export async function getClaimableAmount(params: {
    marketContractAddress: `0x${string}`;
    userAddress: `0x${string}`;
    option: bigint;
    rpcUrl: string;
}): Promise<bigint> {
    const { marketContractAddress, userAddress, option, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const amount = await client.readContract({
        address: marketContractAddress,
        abi: claimableAmountAbi,
        functionName: 'getClaimableAmount',
        args: [userAddress, option],
    });

    return amount as bigint;
}
