import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';
const disputeFeeAbi = parseAbi([
    'function getDisputeAppealFee(uint256 option) view returns (uint256 disputeFee)',
]);
export async function getDisputeAppealFee(params) {
    const { marketContractAddress, option, rpcUrl } = params;
    const client = createPublicClient({
        chain: arbitrum,
        transport: http(rpcUrl),
    });
    const fee = await client.readContract({
        address: marketContractAddress,
        abi: disputeFeeAbi,
        functionName: 'getDisputeAppealFee',
        args: [option],
    });
    return fee;
}
