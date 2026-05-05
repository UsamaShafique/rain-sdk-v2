import { ethers, JsonRpcProvider, Contract } from "ethers";
import { ERC20Abi } from "../abi/ERC20Abi.js";
export const convertToWeiEthers = (value, decimals) => {
    return ethers.parseUnits(value.toString(), decimals);
};
export async function isRpcValid(rpcUrl) {
    if (!rpcUrl)
        return false;
    const provider = new JsonRpcProvider(rpcUrl);
    try {
        await provider.getNetwork();
        return true;
    }
    catch (error) {
        return false;
    }
}
export async function getUserAllowance(params) {
    const { factoryContractAddress, baseToken, creator, rpcUrl } = params;
    const isRpcWorking = await isRpcValid(rpcUrl);
    if (!rpcUrl || !isRpcWorking) {
        throw new Error("Provided RPC URL is not valid or not working");
    }
    const provider = new JsonRpcProvider(rpcUrl);
    const ERC20ApprovalContract = new Contract(baseToken, ERC20Abi, provider);
    const userAllowance = await ERC20ApprovalContract.allowance(creator, factoryContractAddress);
    return userAllowance;
}
