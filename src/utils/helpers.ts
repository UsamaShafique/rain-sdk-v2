import { ethers, JsonRpcProvider, Contract } from "ethers";
import { CreateMarketTxParams } from "../tx/types.js";
import { ERC20Abi } from "../abi/ERC20Abi.js";
import { getMarketBaseToken } from "../markets/getResolverBondAmount.js";

export const convertToWeiEthers = (
    value: string | bigint,
    decimals: number
): bigint => {
    return ethers.parseUnits(value.toString(), decimals);
};

export async function isRpcValid(rpcUrl: string | undefined): Promise<boolean> {
    if (!rpcUrl) return false;
    const provider = new JsonRpcProvider(rpcUrl);
    try {
        await provider.getNetwork();
        return true;
    } catch (error) {
        return false;
    }
}

export async function getUserAllowance(
    params: CreateMarketTxParams
): Promise<number> {
    const { factoryContractAddress, baseToken, creator, rpcUrl } = params
    const isRpcWorking = await isRpcValid(rpcUrl)
    if (!rpcUrl || !isRpcWorking) { throw new Error("Provided RPC URL is not valid or not working") }
    const provider = new JsonRpcProvider(rpcUrl);
    const ERC20ApprovalContract = new Contract(baseToken, ERC20Abi, provider);
    const userAllowance = await ERC20ApprovalContract.allowance(creator, factoryContractAddress)
    return userAllowance
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
    const isRpcWorking = await isRpcValid(rpcUrl);
    if (!rpcUrl || !isRpcWorking) { throw new Error("Provided RPC URL is not valid or not working") }

    const baseToken = await getMarketBaseToken({ marketContractAddress, rpcUrl });

    const provider = new JsonRpcProvider(rpcUrl);
    const tokenContract = new Contract(baseToken, ERC20Abi, provider);

    const [userAllowance, tokenDecimals] = await Promise.all([
        tokenContract.allowance(owner, marketContractAddress),
        tokenContract.decimals(),
    ]);

    return {
        allowance: BigInt(userAllowance),
        baseToken,
        decimals: Number(tokenDecimals),
    };
}
