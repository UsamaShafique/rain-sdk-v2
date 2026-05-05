import { encodeFunctionData, createPublicClient, http, parseAbi } from "viem";
import { arbitrum } from "viem/chains";
import { OracleAbi } from "../abi/OracleAbi.js";
import { RawTransaction } from "./types.js";

const optionResolverAbi = parseAbi(['function optionResolver(uint256 option) view returns (address)']);

export interface CalculateWinnerTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint; // option index (1-based)
}

/**
 * Builds calculateWinner TX.
 * 1. Reads optionResolver(option) from market contract to get the resolver address for that option
 * 2. Encodes calculateWinner() call to that resolver
 */
export async function buildCalculateWinnerRawTx(
    params: CalculateWinnerTxParams & { rpcUrl: string }
): Promise<RawTransaction> {
    const { marketContractAddress, option, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");

    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });

    const resolverAddress = await client.readContract({
        address: marketContractAddress,
        abi: optionResolverAbi,
        functionName: 'optionResolver',
        args: [option],
    });

    if (!resolverAddress || resolverAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error("No resolver set for this option");
    }

    return {
        to: resolverAddress,
        data: encodeFunctionData({
            abi: OracleAbi,
            functionName: 'calculateWinner',
        }),
        value: 0n,
    };
}
