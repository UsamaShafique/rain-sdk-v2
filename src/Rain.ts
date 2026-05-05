import { ApproveTxParams, CreateMarketTxParams, EnterOptionTxParams, AddLiquidityTxParams, RemoveLiquidityTxParams, SplitTxParams, MergeTxParams, ClosePoolAITxParams, ClosePoolManualTxParams, ChooseWinnerTxParams, PlaceBuyOrderTxParams, PlaceSellOrderTxParams, OpenDisputeTxParams, ClaimTxParams, CancelBuyOrdersTxParams, CancelSellOrdersTxParams, RawTransaction } from './tx/types.js';
import { buildApproveRawTx } from './tx/buildApprovalRawTx.js';
import { buildCreateMarketRawTx } from './tx/CreateMarket/buildCreateMarketRawTx.js';
import { buildEnterOptionRawTx } from './tx/buildEnterOptionRawTx.js';
import { buildAddLiquidityRawTx } from './tx/buildAddLiquidityRawTx.js';
import { buildRemoveLiquidityRawTx } from './tx/buildRemoveLiquidityRawTx.js';
import { buildSplitRawTx } from './tx/buildSplitRawTx.js';
import { buildMergeRawTx } from './tx/buildMergeRawTx.js';
import { buildClosePoolAIRawTx, buildClosePoolManualRawTx, buildChooseWinnerRawTx } from './tx/buildClosePoolRawTx.js';
import { buildPlaceBuyOrderRawTx, buildPlaceSellOrderRawTx } from './tx/buildPlaceOrderRawTx.js';
import { buildOpenDisputeRawTx } from './tx/buildOpenDisputeRawTx.js';
import { buildClaimRawTx } from './tx/buildClaimRawTx.js';
import { buildCancelBuyOrdersRawTx, buildCancelSellOrdersRawTx } from './tx/buildCancelOrdersRawTx.js';
import { buildCalculateWinnerRawTx, CalculateWinnerTxParams } from './tx/buildCalculateWinnerRawTx.js';
import { getUserActiveBuyOrders, getUserActiveSellOrders, getFirstBuyOrderPrice, getFirstSellOrderPrice, getBuyOrdersAtPrice, getSellOrdersAtPrice, checkOrderExists } from './markets/getOrderInfo.js';
import { RainCoreConfig, RainEnvironment } from './types.js';
import { ALLOWED_ENVIRONMENTS, ENV_CONFIG, getRandomRpc } from './config/environments.js';
import { loginUser } from './auth/login.js';
import { LoginParams, LoginResult } from './auth/types.js';
import { getUserOptionLPShares } from './markets/getUserOptionLPShares.js';
import { getUserOptionShares } from './markets/getUserOptionShares.js';
import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const erc20AllowanceAbi = parseAbi(['function allowance(address owner, address spender) view returns (uint256)']);

export class Rain {

  public readonly environment: RainEnvironment;
  private readonly marketFactory: `0x${string}`;
  private readonly apiUrl: string;
  private readonly distute_initial_timer: number;
  private readonly oracleFixedFeePerOption: bigint;
  private readonly rpcUrl?: string;

  constructor(config: RainCoreConfig = {}) {
    const { environment = "development", rpcUrl, apiUrl } = config;

    function isValidEnvironment(env: string): env is RainEnvironment {
      return ALLOWED_ENVIRONMENTS.includes(env as RainEnvironment);
    }

    if (!isValidEnvironment(environment)) {
      throw new Error(
        `Invalid environment "${environment}". Allowed values: ${ALLOWED_ENVIRONMENTS.join(", ")}`
      );
    }
    this.environment = environment;
    this.rpcUrl = rpcUrl ?? getRandomRpc();
    const envConfig = ENV_CONFIG[this.environment];
    this.marketFactory = envConfig.market_factory_address
    this.apiUrl = apiUrl ?? envConfig.apiUrl;
    this.distute_initial_timer = envConfig.dispute_initial_timer;
    this.oracleFixedFeePerOption = envConfig.oracle_fixed_fee_per_option;
  }

  buildApprovalTx(params: ApproveTxParams): RawTransaction {
    return buildApproveRawTx(params);
  }

  buildCreateMarketTx(params: CreateMarketTxParams): Promise<RawTransaction[]> {
    return buildCreateMarketRawTx({ ...params, factoryContractAddress: this.marketFactory, apiUrl: this.apiUrl, rpcUrl: this.rpcUrl, disputeTimer: this.distute_initial_timer, oracleFixedFeePerOption: this.oracleFixedFeePerOption });
  }

  buildEnterOptionTx(params: EnterOptionTxParams): RawTransaction {
    return buildEnterOptionRawTx(params);
  }

  buildAddLiquidityTx(params: AddLiquidityTxParams): RawTransaction {
    return buildAddLiquidityRawTx(params);
  }

  buildRemoveLiquidityTx(params: RemoveLiquidityTxParams): RawTransaction {
    return buildRemoveLiquidityRawTx(params);
  }

  async getUserOptionLPShares(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    userAddress: `0x${string}`;
  }): Promise<bigint> {
    return getUserOptionLPShares({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getUserOptionShares(params: {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    userAddress: `0x${string}`;
  }): Promise<bigint> {
    return getUserOptionShares({ ...params, rpcUrl: this.rpcUrl! });
  }

  buildSplitTx(params: SplitTxParams): RawTransaction {
    return buildSplitRawTx(params);
  }

  buildMergeTx(params: MergeTxParams): RawTransaction {
    return buildMergeRawTx(params);
  }

  async buildClosePoolAITx(params: ClosePoolAITxParams): Promise<RawTransaction[]> {
    return buildClosePoolAIRawTx({ ...params, rpcUrl: this.rpcUrl! });
  }

  async buildClosePoolManualTx(params: ClosePoolManualTxParams): Promise<RawTransaction[]> {
    return buildClosePoolManualRawTx({ ...params, rpcUrl: this.rpcUrl! });
  }

  buildChooseWinnerTx(params: ChooseWinnerTxParams): RawTransaction {
    return buildChooseWinnerRawTx(params);
  }

  buildPlaceBuyOrderTx(params: PlaceBuyOrderTxParams): RawTransaction {
    return buildPlaceBuyOrderRawTx(params);
  }

  buildPlaceSellOrderTx(params: PlaceSellOrderTxParams): RawTransaction {
    return buildPlaceSellOrderRawTx(params);
  }

  async buildOpenDisputeTx(params: OpenDisputeTxParams): Promise<RawTransaction[]> {
    return buildOpenDisputeRawTx({ ...params, rpcUrl: this.rpcUrl! });
  }

  async buildCalculateWinnerTx(params: CalculateWinnerTxParams): Promise<RawTransaction> {
    return buildCalculateWinnerRawTx({ ...params, rpcUrl: this.rpcUrl! });
  }

  buildClaimTx(params: ClaimTxParams): RawTransaction {
    return buildClaimRawTx(params);
  }

  buildCancelBuyOrdersTx(params: CancelBuyOrdersTxParams): RawTransaction {
    return buildCancelBuyOrdersRawTx(params);
  }

  buildCancelSellOrdersTx(params: CancelSellOrdersTxParams): RawTransaction {
    return buildCancelSellOrdersRawTx(params);
  }

  async getUserActiveBuyOrders(params: { marketContractAddress: `0x${string}`; userAddress: `0x${string}` }): Promise<bigint> {
    return getUserActiveBuyOrders({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getUserActiveSellOrders(params: { marketContractAddress: `0x${string}`; userAddress: `0x${string}` }): Promise<bigint> {
    return getUserActiveSellOrders({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getFirstBuyOrderPrice(params: { marketContractAddress: `0x${string}`; option: bigint; optionSide: number }): Promise<bigint> {
    return getFirstBuyOrderPrice({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getFirstSellOrderPrice(params: { marketContractAddress: `0x${string}`; option: bigint; optionSide: number }): Promise<bigint> {
    return getFirstSellOrderPrice({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getBuyOrdersAtPrice(params: { marketContractAddress: `0x${string}`; option: bigint; optionSide: number; price: bigint }) {
    return getBuyOrdersAtPrice({ ...params, rpcUrl: this.rpcUrl! });
  }

  async getSellOrdersAtPrice(params: { marketContractAddress: `0x${string}`; option: bigint; optionSide: number; price: bigint }) {
    return getSellOrdersAtPrice({ ...params, rpcUrl: this.rpcUrl! });
  }

  async checkOrderExists(params: { marketContractAddress: `0x${string}`; option: bigint; optionSide: number; price: bigint; orderID: bigint }) {
    return checkOrderExists({ ...params, rpcUrl: this.rpcUrl! });
  }

  async login(params: LoginParams): Promise<LoginResult> {
    return loginUser({ ...params, apiUrl: this.apiUrl });
  }

  async getTokenAllowance(params: {
    tokenAddress: `0x${string}`;
    owner: `0x${string}`;
    spender: `0x${string}`;
  }): Promise<bigint> {
    const publicClient = createPublicClient({
      chain: arbitrum,
      transport: http(this.rpcUrl),
    });

    const allowance = await publicClient.readContract({
      address: params.tokenAddress,
      abi: erc20AllowanceAbi,
      functionName: 'allowance',
      args: [params.owner, params.spender],
    });

    return allowance;
  }

  getEnvironmentConfig() {
    return ENV_CONFIG[this.environment];
  }
}
