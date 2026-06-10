import { encodeFunctionData, createPublicClient, http, parseAbi } from "viem";
import { arbitrum } from "viem/chains";
import { OracleAbi } from "../abi/OracleAbi.js";
import { RawTransaction } from "./types.js";

const optionResolverAbi = parseAbi(['function optionResolver(uint256 option) view returns (address)']);

export interface ExtendTimeTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    newEndTime: bigint;
    signature: `0x${string}`;
}

export async function buildExtendTimeRawTx(
    params: ExtendTimeTxParams & { rpcUrl: string }
): Promise<RawTransaction> {
    const { marketContractAddress, option, newEndTime, signature, rpcUrl } = params;

    if (!marketContractAddress) throw new Error("marketContractAddress is required");
    if (option === undefined || option === null) throw new Error("option is required");
    if (!newEndTime) throw new Error("newEndTime is required");
    if (!signature) throw new Error("signature is required");

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
            functionName: 'extendTime',
            args: [newEndTime, signature],
        }),
        value: 0n,
    };
}
