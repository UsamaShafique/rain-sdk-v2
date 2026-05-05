import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';
const orderInfoAbi = parseAbi([
    'function userActiveBuyOrders(address user) view returns (uint256)',
    'function userActiveSellOrders(address user) view returns (uint256)',
    'function firstBuyOrderPrice(uint256 option, uint8 optionSide) view returns (uint256)',
    'function firstSellOrderPrice(uint256 option, uint8 optionSide) view returns (uint256)',
    'function buyOrders(uint256 option, uint8 optionSide, uint256 price) view returns (int256 headIndex, int256 tailIndex, int256 count, bool isInitialized)',
    'function sellOrders(uint256 option, uint8 optionSide, uint256 price) view returns (int256 headIndex, int256 tailIndex, int256 count, bool isInitialized)',
    'function orderBook(uint256 option, uint8 optionSide, uint256 price, uint256 orderID) view returns (bool exists, int256 index)',
]);
function getClient(rpcUrl) {
    return createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });
}
export async function getUserActiveBuyOrders(params) {
    const client = getClient(params.rpcUrl);
    return await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'userActiveBuyOrders',
        args: [params.userAddress],
    });
}
export async function getUserActiveSellOrders(params) {
    const client = getClient(params.rpcUrl);
    return await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'userActiveSellOrders',
        args: [params.userAddress],
    });
}
export async function getFirstBuyOrderPrice(params) {
    const client = getClient(params.rpcUrl);
    return await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'firstBuyOrderPrice',
        args: [params.option, params.optionSide],
    });
}
export async function getFirstSellOrderPrice(params) {
    const client = getClient(params.rpcUrl);
    return await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'firstSellOrderPrice',
        args: [params.option, params.optionSide],
    });
}
export async function getBuyOrdersAtPrice(params) {
    const client = getClient(params.rpcUrl);
    const [headIndex, tailIndex, count, isInitialized] = await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'buyOrders',
        args: [params.option, params.optionSide, params.price],
    });
    return { headIndex, tailIndex, count, isInitialized };
}
export async function getSellOrdersAtPrice(params) {
    const client = getClient(params.rpcUrl);
    const [headIndex, tailIndex, count, isInitialized] = await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'sellOrders',
        args: [params.option, params.optionSide, params.price],
    });
    return { headIndex, tailIndex, count, isInitialized };
}
export async function checkOrderExists(params) {
    const client = getClient(params.rpcUrl);
    const [exists, index] = await client.readContract({
        address: params.marketContractAddress,
        abi: orderInfoAbi,
        functionName: 'orderBook',
        args: [params.option, params.optionSide, params.price, params.orderID],
    });
    return { exists, index };
}
