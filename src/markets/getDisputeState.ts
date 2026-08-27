import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { MarketsAbi } from '../abi/MarketsAbi.js';

export interface OptionDisputeInfo {
    disputeFee: bigint;
    disputedWinner: bigint;
    disputer: `0x${string}`;
    disputeResolver: `0x${string}`;
}

export interface OptionAppealInfo {
    disputeFee: bigint;
    disputedWinner: bigint;
    disputer: `0x${string}`;
    appealResolver: `0x${string}`;
}

interface OptionReadParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    rpcUrl: string;
}

function client(rpcUrl: string) {
    return createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });
}

export async function optionResolverBond(params: OptionReadParams): Promise<bigint> {
    const { marketContractAddress, option, rpcUrl } = params;

    const bond = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'optionResolverBond',
        args: [option],
    });

    return bond as bigint;
}

export async function optionResolutionProposer(params: OptionReadParams): Promise<`0x${string}`> {
    const { marketContractAddress, option, rpcUrl } = params;

    const proposer = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'optionResolutionProposer',
        args: [option],
    });

    return proposer as `0x${string}`;
}

export async function isOptionDisputed(params: OptionReadParams): Promise<boolean> {
    const { marketContractAddress, option, rpcUrl } = params;

    const disputed = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'isOptionDisputed',
        args: [option],
    });

    return disputed as boolean;
}

export async function isOptionAppealed(params: OptionReadParams): Promise<boolean> {
    const { marketContractAddress, option, rpcUrl } = params;

    const appealed = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'isOptionAppealed',
        args: [option],
    });

    return appealed as boolean;
}

export async function optionDispute(params: OptionReadParams): Promise<OptionDisputeInfo> {
    const { marketContractAddress, option, rpcUrl } = params;

    const [disputeFee, disputedWinner, disputer, disputeResolver] = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'optionDispute',
        args: [option],
    }) as readonly [bigint, bigint, `0x${string}`, `0x${string}`];

    return { disputeFee, disputedWinner, disputer, disputeResolver };
}

export async function optionAppeal(params: OptionReadParams): Promise<OptionAppealInfo> {
    const { marketContractAddress, option, rpcUrl } = params;

    const [disputeFee, disputedWinner, disputer, appealResolver] = await client(rpcUrl).readContract({
        address: marketContractAddress,
        abi: MarketsAbi,
        functionName: 'optionAppeal',
        args: [option],
    }) as readonly [bigint, bigint, `0x${string}`, `0x${string}`];

    return { disputeFee, disputedWinner, disputer, appealResolver };
}
