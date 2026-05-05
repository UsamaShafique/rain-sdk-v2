import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const resolverBondAbi = parseAbi([
    'function getResolverBondAmount(uint256 option) view returns (uint256 resolverBondAmount)',
]);

const baseTokenAbi = parseAbi([
    'function baseToken() view returns (address)',
]);

export async function getResolverBondAmount(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    rpcUrl: string;
}): Promise<bigint> {
    const { marketContractAddress, option, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const bond = await client.readContract({
        address: marketContractAddress,
        abi: resolverBondAbi,
        functionName: 'getResolverBondAmount',
        args: [option],
    });

    return bond;
}

export async function getMarketBaseToken(params: {
    marketContractAddress: `0x${string}`;
    rpcUrl: string;
}): Promise<`0x${string}`> {
    const { marketContractAddress, rpcUrl } = params;

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const token = await client.readContract({
        address: marketContractAddress,
        abi: baseTokenAbi,
        functionName: 'baseToken',
    });

    return token;
}
