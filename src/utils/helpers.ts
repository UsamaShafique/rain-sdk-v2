import { parseUnits, createPublicClient, http, type Abi, type Address } from "viem";
import { arbitrum } from "viem/chains";
import { CreateMarketTxParams } from "../tx/types.js";
import { ERC20Abi } from "../abi/ERC20Abi.js";
import { getMarketBaseToken } from "../markets/getResolverBondAmount.js";

const erc20Abi = ERC20Abi as Abi;

export const convertToWeiEthers = (
    value: string | bigint,
    decimals: number
): bigint => {
    return parseUnits(value.toString(), decimals);
};

/** Lightweight RPC liveness check via viem `getChainId`. Kept for callers that want a pre-flight probe. */
export async function isRpcValid(rpcUrl: string | undefined): Promise<boolean> {
    if (!rpcUrl) return false;
    try {
        const client = createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });
        await client.getChainId();
        return true;
    } catch {
        return false;
    }
}

export async function getUserAllowance(
    params: CreateMarketTxParams
): Promise<bigint> {
    const { factoryContractAddress, baseToken, creator, rpcUrl } = params;
    if (!rpcUrl) throw new Error("Provided RPC URL is not valid or not working");
    const client = createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });
    const allowance = await client.readContract({
        address: baseToken as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [creator as Address, factoryContractAddress as Address],
    });
    return allowance as bigint;
}

/**
 * Checks allowance for a market's base token.
 * Reads baseToken from the market contract, then checks the ERC20 allowance.
 * Also returns the token decimals by reading from the ERC20 contract.
 */
export async function checkMarketTokenAllowance(
    params: { marketContractAddress: `0x${string}`; owner: `0x${string}`; rpcUrl: string }
): Promise<{ allowance: bigint; baseToken: `0x${string}`; decimals: number }> {
    const { marketContractAddress, owner, rpcUrl } = params;
    if (!rpcUrl) throw new Error("Provided RPC URL is not valid or not working");

    const baseToken = await getMarketBaseToken({ marketContractAddress, rpcUrl });
    const client = createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });

    const [userAllowance, tokenDecimals] = await Promise.all([
        client.readContract({ address: baseToken, abi: erc20Abi, functionName: 'allowance', args: [owner, marketContractAddress] }),
        client.readContract({ address: baseToken, abi: erc20Abi, functionName: 'decimals' }),
    ]);

    return {
        allowance: userAllowance as bigint,
        baseToken,
        decimals: Number(tokenDecimals),
    };
}
