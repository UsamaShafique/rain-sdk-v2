export declare function getUserActiveBuyOrders(params: {
    marketContractAddress: `0x${string}`;
    userAddress: `0x${string}`;
    rpcUrl: string;
}): Promise<bigint>;
export declare function getUserActiveSellOrders(params: {
    marketContractAddress: `0x${string}`;
    userAddress: `0x${string}`;
    rpcUrl: string;
}): Promise<bigint>;
export declare function getFirstBuyOrderPrice(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    rpcUrl: string;
}): Promise<bigint>;
export declare function getFirstSellOrderPrice(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    rpcUrl: string;
}): Promise<bigint>;
export interface OrderLevelInfo {
    headIndex: bigint;
    tailIndex: bigint;
    count: bigint;
    isInitialized: boolean;
}
export declare function getBuyOrdersAtPrice(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    price: bigint;
    rpcUrl: string;
}): Promise<OrderLevelInfo>;
export declare function getSellOrdersAtPrice(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    price: bigint;
    rpcUrl: string;
}): Promise<OrderLevelInfo>;
export declare function checkOrderExists(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    price: bigint;
    orderID: bigint;
    rpcUrl: string;
}): Promise<{
    exists: boolean;
    index: bigint;
}>;
