export interface RawTransaction {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
}
export type ApproveTxParams = {
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
    amount: bigint;
};
export declare enum TradingModel {
    AMM = 0,
    OrderBook = 1
}
export declare enum OptionSide {
    Yes = 1,
    No = 2
}
export interface EnterOptionTxParams {
    marketContractAddress: `0x${string}`;
    selectedOption: bigint;
    optionSide: OptionSide;
    buyAmountInWei: bigint;
}
export interface PlaceBuyOrderTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: OptionSide;
    price: bigint;
    amount: bigint;
}
export interface PlaceSellOrderTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: OptionSide;
    price: bigint;
    shares: bigint;
}
export interface CancelBuyOrdersTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSides: number[];
    prices: bigint[];
    orderIDs: bigint[];
}
export interface CancelSellOrdersTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSides: number[];
    prices: bigint[];
    orderIDs: bigint[];
}
export interface ClaimTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
}
export interface OpenDisputeTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
}
export interface ClosePoolAITxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
}
export interface ClosePoolManualTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    proposedWinner: number;
}
export interface ChooseWinnerTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
}
export interface SplitTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    amount: bigint;
}
export interface MergeTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    amount: bigint;
}
export interface AddLiquidityTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    totalAmountInWei: bigint;
}
export interface RemoveLiquidityTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    lpShares: bigint;
}
export interface CreateMarketTxParams {
    marketQuestion: string;
    marketOptions: string[];
    marketTags: string[];
    marketDescription: string;
    isPublic: boolean;
    isPublicPoolResolverAi: boolean;
    creator: `0x${string}`;
    startTime: bigint;
    endTime: bigint;
    no_of_options: bigint;
    disputeTimer: number;
    inputAmountWei: bigint;
    barValues: number[];
    baseToken: `0x${string}`;
    tradingModel?: TradingModel;
    tokenDecimals?: number;
    factoryContractAddress?: `0x${string}`;
    oracleFixedFeePerOption?: bigint;
    apiUrl?: string;
    rpcUrl?: string;
}
