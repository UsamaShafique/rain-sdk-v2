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

export enum TradingModel {
    AMM = 0,
    OrderBook = 1,
}

export enum OptionSide {
    Yes = 1,
    No = 2,
}

export interface EnterOptionTxParams {
    marketContractAddress: `0x${string}`;
    selectedOption: bigint;  // option index (1-based)
    optionSide: OptionSide;  // 0 = Yes, 1 = No
    buyAmountInWei: bigint;  // amount in base token wei
    minSharesOut?: bigint;   // slippage protection: minimum shares to receive (auto-calculated if not set)
    slippageTolerance?: bigint; // slippage % (e.g. 5n = 5%). Defaults to 5% if minSharesOut is not set
    deadline?: bigint;       // absolute unix timestamp (defaults to now + 10 min)
}

export interface SellOptionTxParams {
    marketContractAddress: `0x${string}`;
    selectedOption: bigint;  // option index (1-based)
    optionSide: OptionSide;  // Yes = 1, No = 2
    sharesAmount: bigint;    // number of shares to sell
    minAmountOut?: bigint;   // slippage protection: minimum base tokens to receive (defaults to 0)
    deadline?: bigint;       // absolute unix timestamp (defaults to now + 10 min)
}

export interface PlaceBuyOrderTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;        // option index (1-based)
    optionSide: OptionSide; // Yes = 1, No = 2
    price: bigint;         // price per share in 1e18 scale (e.g. 0.5 = 500000000000000000n)
    amount: bigint;        // total buy amount in base token wei
    postOnly?: boolean;    // maker-only placement (reverts OrderWouldCross if it would cross). Defaults to false.
}

export interface PlaceSellOrderTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;        // option index (1-based)
    optionSide: OptionSide; // Yes = 1, No = 2
    price: bigint;         // price per share in 1e18 scale
    shares: bigint;        // number of shares to sell
    postOnly?: boolean;    // maker-only placement (reverts OrderWouldCross if it would cross). Defaults to false.
}

export interface CancelBuyOrdersTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;          // option index (1-based)
    optionSides: number[];   // array of sides (1=Yes, 2=No)
    prices: bigint[];        // array of prices in 1e18 scale
    orderIDs: bigint[];      // array of order IDs
}

export interface CancelSellOrdersTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;          // option index (1-based)
    optionSides: number[];   // array of sides (1=Yes, 2=No)
    prices: bigint[];        // array of prices in 1e18 scale
    orderIDs: bigint[];      // array of order IDs
}

export interface ClaimTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint; // option index (1-based)
}

export interface OpenDisputeTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint; // option index (1-based)
}

export interface ClosePoolAITxParams {
    marketContractAddress: `0x${string}`;
    option: bigint; // option index (1-based)
}

export interface ClosePoolManualTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;        // option index (1-based)
    proposedWinner: number; // proposed winning side (1 = Yes, 2 = No)
}

export interface ChooseWinnerTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;      // option index (1-based)
    optionSide: number;  // winning side (1 = Yes, 2 = No)
}

export interface SplitTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;   // option index (1-based)
    amount: bigint;   // amount of base token wei to split into Yes + No shares
}

export interface MergeTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;   // option index (1-based)
    amount: bigint;   // amount of Yes + No share pairs to merge back into base token
}

export interface AddLiquidityTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;            // option index (1-based)
    totalAmountInWei: bigint;  // amount in base token wei
    minYesToDeposit?: bigint;  // slippage protection: min yes tokens to deposit (auto-calculated if not set)
    minNoToDeposit?: bigint;   // slippage protection: min no tokens to deposit (auto-calculated if not set)
    slippageTolerance?: bigint; // slippage % (e.g. 5n = 5%). Defaults to 5% if min values not set
    deadline?: bigint;         // unix timestamp deadline (defaults to now + 10 min)
}

export interface RemoveLiquidityTxParams {
    marketContractAddress: `0x${string}`;
    option: bigint;     // option index (1-based)
    lpShares: bigint;   // LP shares to remove
    minYesOut?: bigint;  // slippage protection: min yes tokens to receive (auto-calculated if not set)
    minNoOut?: bigint;   // slippage protection: min no tokens to receive (auto-calculated if not set)
    slippageTolerance?: bigint; // slippage % (e.g. 5n = 5%). Defaults to 5% if min values not set
    deadline?: bigint;   // unix timestamp deadline (defaults to now + 10 min)
}

export interface CreateMarketTxParams {
    marketQuestion: string;
    marketOptions: string[];
    marketTags: string[];
    marketDescription: string;
    isPublic: boolean;
    isPublicPoolResolverAi: boolean;
    creator: `0x${string}`; // smartAccount
    startTime: bigint; // unix timestamp (seconds)
    endTime: bigint;   // unix timestamp (seconds)
    no_of_options: bigint; // market options
    disputeTimer: number; // oracle end time duration in seconds (e.g. 259200 = 3 days)
    inputAmountWei: bigint;
    barValues: number[]; // transformedBarValues
    baseToken: `0x${string}`; // TOKEN contract address
    tradingModel?: TradingModel;
    initialYesPrices?: bigint[];
    marketImage: string;
    tokenDecimals?: number;
    factoryContractAddress?: `0x${string}`;
    oracleFixedFeePerOption?: bigint;
    apiUrl?: string;
    rpcUrl?: string;
}
