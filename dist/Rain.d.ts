import { ApproveTxParams, CreateMarketTxParams, EnterOptionTxParams, AddLiquidityTxParams, RemoveLiquidityTxParams, SplitTxParams, MergeTxParams, ClosePoolAITxParams, ClosePoolManualTxParams, ChooseWinnerTxParams, PlaceBuyOrderTxParams, PlaceSellOrderTxParams, OpenDisputeTxParams, ClaimTxParams, CancelBuyOrdersTxParams, CancelSellOrdersTxParams, RawTransaction } from './tx/types.js';
import { CalculateWinnerTxParams } from './tx/buildCalculateWinnerRawTx.js';
import { RainCoreConfig, RainEnvironment } from './types.js';
import { LoginParams, LoginResult } from './auth/types.js';
export declare class Rain {
    readonly environment: RainEnvironment;
    private readonly marketFactory;
    private readonly apiUrl;
    private readonly distute_initial_timer;
    private readonly oracleFixedFeePerOption;
    private readonly rpcUrl?;
    constructor(config?: RainCoreConfig);
    buildApprovalTx(params: ApproveTxParams): RawTransaction;
    buildCreateMarketTx(params: CreateMarketTxParams): Promise<RawTransaction[]>;
    buildEnterOptionTx(params: EnterOptionTxParams): RawTransaction;
    buildAddLiquidityTx(params: AddLiquidityTxParams): RawTransaction;
    buildRemoveLiquidityTx(params: RemoveLiquidityTxParams): RawTransaction;
    getUserOptionLPShares(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        userAddress: `0x${string}`;
    }): Promise<bigint>;
    getUserOptionShares(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
        userAddress: `0x${string}`;
    }): Promise<bigint>;
    buildSplitTx(params: SplitTxParams): RawTransaction;
    buildMergeTx(params: MergeTxParams): RawTransaction;
    buildClosePoolAITx(params: ClosePoolAITxParams): Promise<RawTransaction[]>;
    buildClosePoolManualTx(params: ClosePoolManualTxParams): Promise<RawTransaction[]>;
    buildChooseWinnerTx(params: ChooseWinnerTxParams): RawTransaction;
    buildPlaceBuyOrderTx(params: PlaceBuyOrderTxParams): RawTransaction;
    buildPlaceSellOrderTx(params: PlaceSellOrderTxParams): RawTransaction;
    buildOpenDisputeTx(params: OpenDisputeTxParams): Promise<RawTransaction[]>;
    buildCalculateWinnerTx(params: CalculateWinnerTxParams): Promise<RawTransaction>;
    buildClaimTx(params: ClaimTxParams): RawTransaction;
    buildCancelBuyOrdersTx(params: CancelBuyOrdersTxParams): RawTransaction;
    buildCancelSellOrdersTx(params: CancelSellOrdersTxParams): RawTransaction;
    getUserActiveBuyOrders(params: {
        marketContractAddress: `0x${string}`;
        userAddress: `0x${string}`;
    }): Promise<bigint>;
    getUserActiveSellOrders(params: {
        marketContractAddress: `0x${string}`;
        userAddress: `0x${string}`;
    }): Promise<bigint>;
    getFirstBuyOrderPrice(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
    }): Promise<bigint>;
    getFirstSellOrderPrice(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
    }): Promise<bigint>;
    getBuyOrdersAtPrice(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
        price: bigint;
    }): Promise<import("./markets/getOrderInfo.js").OrderLevelInfo>;
    getSellOrdersAtPrice(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
        price: bigint;
    }): Promise<import("./markets/getOrderInfo.js").OrderLevelInfo>;
    checkOrderExists(params: {
        marketContractAddress: `0x${string}`;
        option: bigint;
        optionSide: number;
        price: bigint;
        orderID: bigint;
    }): Promise<{
        exists: boolean;
        index: bigint;
    }>;
    login(params: LoginParams): Promise<LoginResult>;
    getTokenAllowance(params: {
        tokenAddress: `0x${string}`;
        owner: `0x${string}`;
        spender: `0x${string}`;
    }): Promise<bigint>;
    getEnvironmentConfig(): {
        readonly apiUrl: "https://dev-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USDTm";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    } | {
        readonly apiUrl: "https://stg-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USD₮0";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    } | {
        readonly apiUrl: "https://prod-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USD₮0";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    };
}
