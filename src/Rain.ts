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
import { getDynamicPayout } from './markets/getDynamicPayout.js';
import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';
import type { ApiConfig, UserProfileUpdateParams, UserHistoryParams, CreateCommentParams, CommentsListingParams, UpdateCommentParams, CommentCountParams, PublicPoolsParams, PrivatePoolsParams, PoolListingByCreatorParams, VerifyAccessCodeParams, PoolTotalParticipantsParams, SearchPoolParams, RelatedPoolsParams, UpdateStreamingParams, UpdatePoolResolutionTimeParams, FindPoolFallbackParams, SignOraclesExtendTimeParams, UserTotalInvestmentParams, OptionsTotalVolumeParams, PoolActivityParams, TopHoldersParams, UserInvestedPoolsParams, InvestmentVolumeGraphParams, UserPnlGraphParams, TopWinnersLosersParams, PnlByPoolIdParams, PriceDataParams, AddReviewParams, GetUserOrdersParams, OrderBookParams, GetUserOrderByPoolIdParams, OrdersListingByPoolParams, AddUserPointsParams, UserOnboardingParams, PointsGraphParams, GetNotificationsParams, MarkNotificationAsReadParams, CreateDisputeMessageParams, GetPoolDisputeConvoParams, FollowToggleParams, FollowCheckParams, FollowListParams, FollowStatsParams, RainBurnPerPoolParams } from './api/types.js';
import * as usersApi from './api/users.js';
import * as commentsApi from './api/comments.js';
import * as poolsApi from './api/pools.js';
import * as investmentsApi from './api/investments.js';
import * as priceDataApi from './api/priceData.js';
import * as poolReviewsApi from './api/poolReviews.js';
import * as ordersApi from './api/orders.js';
import * as pointsApi from './api/points.js';
import * as notificationsApi from './api/notifications.js';
import * as rainBurnApi from './api/rainBurn.js';
import * as disputeApi from './api/dispute.js';
import * as followApi from './api/follow.js';

const erc20AllowanceAbi = parseAbi(['function allowance(address owner, address spender) view returns (uint256)']);
const factoryViewAbi = parseAbi([
  'function oracleFixedFee() view returns (uint256)',
  'function liquidityFee() view returns (uint256)',
  'function baseToken() view returns (address)',
]);
const erc20DecimalsAbi = parseAbi(['function decimals() view returns (uint8)']);

export class Rain {

  public readonly environment: RainEnvironment;
  private readonly marketFactory: `0x${string}`;
  private readonly apiUrl: string;
  private readonly distute_initial_timer: number;
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
  }

  /**
   * Get token config by address. Returns decimals, symbol, and oracle fee.
   */
  getTokenConfig(tokenAddress: `0x${string}`) {
    const envConfig = ENV_CONFIG[this.environment];
    const tokens = envConfig.tokens;
    for (const key of Object.keys(tokens) as Array<keyof typeof tokens>) {
      if (tokens[key].address.toLowerCase() === tokenAddress.toLowerCase()) {
        return tokens[key];
      }
    }
    return null;
  }

  buildApprovalTx(params: ApproveTxParams): RawTransaction {
    return buildApproveRawTx(params);
  }

  async getCreateMarketFees(tokenAddress: `0x${string}`): Promise<{ oracleFeePerOption: bigint; liquidityFeeBps: bigint }> {
    const pc = createPublicClient({ chain: arbitrum, transport: http(this.rpcUrl) });
    const [oracleFeeRaw, liquidityFeeBps, factoryBaseToken] = await Promise.all([
      pc.readContract({ address: this.marketFactory, abi: factoryViewAbi, functionName: 'oracleFixedFee' }),
      pc.readContract({ address: this.marketFactory, abi: factoryViewAbi, functionName: 'liquidityFee' }),
      pc.readContract({ address: this.marketFactory, abi: factoryViewAbi, functionName: 'baseToken' }),
    ]);
    if (tokenAddress.toLowerCase() === (factoryBaseToken as string).toLowerCase()) {
      return { oracleFeePerOption: oracleFeeRaw as bigint, liquidityFeeBps: liquidityFeeBps as bigint };
    }
    const baseTokenDecimals = await pc.readContract({ address: factoryBaseToken as `0x${string}`, abi: erc20DecimalsAbi, functionName: 'decimals' });
    const tokenConfig = this.getTokenConfig(tokenAddress);
    const tokenDecimals = BigInt(tokenConfig?.decimals ?? 18);
    const oracleFeePerOption = (oracleFeeRaw as bigint) * (10n ** (tokenDecimals - BigInt(baseTokenDecimals)));
    return { oracleFeePerOption, liquidityFeeBps: liquidityFeeBps as bigint };
  }

  async buildCreateMarketTx(params: CreateMarketTxParams): Promise<RawTransaction[]> {
    const tokenConfig = this.getTokenConfig(params.baseToken);
    const tokenDecimals = params.tokenDecimals ?? tokenConfig?.decimals ?? 6;
    const { oracleFeePerOption, liquidityFeeBps } = await this.getCreateMarketFees(params.baseToken);
    const liquidityFeeAmount = params.inputAmountWei * liquidityFeeBps / 10000n;
    const totalOracleFee = oracleFeePerOption * BigInt(params.no_of_options) + liquidityFeeAmount;
    return buildCreateMarketRawTx({ ...params, tokenDecimals, factoryContractAddress: this.marketFactory, apiUrl: this.apiUrl, rpcUrl: this.rpcUrl, disputeTimer: this.distute_initial_timer, oracleFixedFeePerOption: totalOracleFee / BigInt(params.no_of_options) + 1n });
  }

  async buildEnterOptionTx(params: EnterOptionTxParams & { walletAddress: `0x${string}` }): Promise<RawTransaction[]> {
    return buildEnterOptionRawTx({ ...params, rpcUrl: this.rpcUrl! });
  }

  async buildAddLiquidityTx(params: AddLiquidityTxParams & { walletAddress: `0x${string}` }): Promise<RawTransaction[]> {
    return buildAddLiquidityRawTx({ ...params, rpcUrl: this.rpcUrl! });
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

  async getDynamicPayout(params: {
    marketContractAddress: `0x${string}`;
    userAddress: `0x${string}`;
    option: bigint;
  }): Promise<bigint[]> {
    return getDynamicPayout({ ...params, rpcUrl: this.rpcUrl! });
  }

  async buildSplitTx(params: SplitTxParams & { walletAddress: `0x${string}` }): Promise<RawTransaction[]> {
    return buildSplitRawTx({ ...params, rpcUrl: this.rpcUrl! });
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

  async buildPlaceBuyOrderTx(params: PlaceBuyOrderTxParams & { walletAddress: `0x${string}` }): Promise<RawTransaction[]> {
    return buildPlaceBuyOrderRawTx({ ...params, rpcUrl: this.rpcUrl! });
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

  // ─── Helper ──────────────────────────────────────────────────────────────────

  private cfg(accessToken?: string): ApiConfig {
    return { apiUrl: this.apiUrl, accessToken };
  }

  // ─── Users ───────────────────────────────────────────────────────────────────

  async findUserByWalletAddress(params: { walletAddress: string }, accessToken?: string) {
    return usersApi.findUserByWalletAddress(params, this.cfg(accessToken));
  }

  async updateUserProfile(params: UserProfileUpdateParams, accessToken: string) {
    return usersApi.updateUserProfile(params, this.cfg(accessToken));
  }

  async getUserProfile(accessToken: string) {
    return usersApi.getUserProfile(this.cfg(accessToken));
  }

  async getUsersTotalCount() {
    return usersApi.getUsersTotalCount(this.cfg());
  }

  async removeUserProfilePic(accessToken: string) {
    return usersApi.removeUserProfilePic(this.cfg(accessToken));
  }

  async getUserHistory(params: UserHistoryParams, accessToken: string) {
    return usersApi.getUserHistory(params, this.cfg(accessToken));
  }

  // ─── Comments ────────────────────────────────────────────────────────────────

  async createComment(params: CreateCommentParams, accessToken: string) {
    return commentsApi.createComment(params, this.cfg(accessToken));
  }

  async getCommentsListing(params: CommentsListingParams, accessToken?: string) {
    return commentsApi.getCommentsListing(params, this.cfg(accessToken));
  }

  async updateComment(params: UpdateCommentParams, accessToken: string) {
    return commentsApi.updateComment(params, this.cfg(accessToken));
  }

  async likeComment(params: { commentId: string }, accessToken: string) {
    return commentsApi.likeComment(params, this.cfg(accessToken));
  }

  async unlikeComment(params: { commentId: string }, accessToken: string) {
    return commentsApi.unlikeComment(params, this.cfg(accessToken));
  }

  async getCommentsCount(params: CommentCountParams, accessToken?: string) {
    return commentsApi.getCommentsCount(params, this.cfg(accessToken));
  }

  // ─── Pools ───────────────────────────────────────────────────────────────────


  async accessPool(params: { poolId: string; accessCode: string }, accessToken?: string) {
    return poolsApi.accessPool(params, this.cfg(accessToken));
  }

  async getPublicPools(params: PublicPoolsParams, accessToken?: string) {
    return poolsApi.getPublicPools(params, this.cfg(accessToken));
  }

  async getPrivatePools(params: PrivatePoolsParams, accessToken?: string) {
    return poolsApi.getPrivatePools(params, this.cfg(accessToken));
  }

  async getPoolById(params: { id: string }, accessToken?: string) {
    return poolsApi.getPoolById(params, this.cfg(accessToken));
  }

  async getPoolByContractAddress(params: { contractAddress: string }, accessToken?: string) {
    return poolsApi.getPoolByContractAddress(params, this.cfg(accessToken));
  }

  async searchPool(params: SearchPoolParams, accessToken?: string) {
    return poolsApi.searchPool(params, this.cfg(accessToken));
  }

  async verifyAccessCode(params: VerifyAccessCodeParams, accessToken?: string) {
    return poolsApi.verifyAccessCode(params, this.cfg(accessToken));
  }

  async getPoolListingByCreator(params: PoolListingByCreatorParams, accessToken: string) {
    return poolsApi.getPoolListingByCreator(params, this.cfg(accessToken));
  }

  async searchPoolById(params: { poolId: string }, accessToken?: string) {
    return poolsApi.searchPoolById(params, this.cfg(accessToken));
  }

  async getPoolTotalParticipants(params: PoolTotalParticipantsParams, accessToken?: string) {
    return poolsApi.getPoolTotalParticipants(params, this.cfg(accessToken));
  }

  async getTotalPoolsByUser(accessToken: string) {
    return poolsApi.getTotalPoolsByUser(this.cfg(accessToken));
  }

  async signOraclesExtendTime(params: SignOraclesExtendTimeParams, accessToken: string) {
    return poolsApi.signOraclesExtendTime(params, this.cfg(accessToken));
  }

  async getTotalPredictionsByUser(accessToken: string) {
    return poolsApi.getTotalPredictionsByUser(this.cfg(accessToken));
  }

  async updateStreaming(params: UpdateStreamingParams, accessToken: string) {
    return poolsApi.updateStreaming(params, this.cfg(accessToken));
  }

  async getAllPoolsCount(accessToken?: string) {
    return poolsApi.getAllPoolsCount(this.cfg(accessToken));
  }

  async getRelatedPools(params: RelatedPoolsParams, accessToken?: string) {
    return poolsApi.getRelatedPools(params, this.cfg(accessToken));
  }

  async getPoolResolutionHistory(params: { poolId: string; subPool: string }, accessToken?: string) {
    return poolsApi.getPoolResolutionHistory(params, this.cfg(accessToken));
  }

  async viewUserProfile(params: { userId: string }, accessToken?: string) {
    return usersApi.viewUserProfile(params, this.cfg(accessToken));
  }

  async checkTokenExpiration(accessToken: string) {
    return usersApi.checkTokenExpiration(this.cfg(accessToken));
  }

  async updatePoolResolutionTime(params: UpdatePoolResolutionTimeParams, accessToken: string) {
    return poolsApi.updatePoolResolutionTime(params, this.cfg(accessToken));
  }

  async findPoolFallback(params: FindPoolFallbackParams, accessToken: string) {
    return poolsApi.findPoolFallback(params, this.cfg(accessToken));
  }

  async getFeaturedPools(accessToken?: string) {
    return poolsApi.getFeaturedPools(this.cfg(accessToken));
  }

  // ─── Investments ─────────────────────────────────────────────────────────────

  async getUserTotalInvestment(params: UserTotalInvestmentParams, accessToken: string) {
    return investmentsApi.getUserTotalInvestment(params, this.cfg(accessToken));
  }

  async getOptionsTotalVolume(params: OptionsTotalVolumeParams, accessToken?: string) {
    return investmentsApi.getOptionsTotalVolume(params, this.cfg(accessToken));
  }

  async getPoolActivity(params: PoolActivityParams, accessToken?: string) {
    return investmentsApi.getPoolActivity(params, this.cfg(accessToken));
  }

  async getTopHolders(params: TopHoldersParams, accessToken?: string) {
    return investmentsApi.getTopHolders(params, this.cfg(accessToken));
  }

  async getUserInvestedPools(params: UserInvestedPoolsParams, accessToken: string) {
    return investmentsApi.getUserInvestedPools(params, this.cfg(accessToken));
  }

  async getPlatformTVL(accessToken?: string) {
    return investmentsApi.getPlatformTVL(this.cfg(accessToken));
  }

  async getInvestmentVolumeGraph(params: InvestmentVolumeGraphParams, accessToken?: string) {
    return investmentsApi.getInvestmentVolumeGraph(params, this.cfg(accessToken));
  }

  async calculateUserPNL(accessToken: string) {
    return investmentsApi.calculateUserPNL(this.cfg(accessToken));
  }

  async calculateUserTotalVolume(accessToken: string) {
    return investmentsApi.calculateUserTotalVolume(this.cfg(accessToken));
  }

  async getUserPnlGraph(params: UserPnlGraphParams, accessToken: string) {
    return investmentsApi.getUserPnlGraph(params, this.cfg(accessToken));
  }

  async getTVLGraph(accessToken?: string) {
    return investmentsApi.getTVLGraph(this.cfg(accessToken));
  }

  async calculateUserPNLPerPool(accessToken: string) {
    return investmentsApi.calculateUserPNLPerPool(this.cfg(accessToken));
  }

  async getPnlByPoolId(params: PnlByPoolIdParams, accessToken: string) {
    return investmentsApi.getPnlByPoolId(params, this.cfg(accessToken));
  }

  async getTopWinnersLosers(params: TopWinnersLosersParams, accessToken?: string) {
    return investmentsApi.getTopWinnersLosers(params, this.cfg(accessToken));
  }

  async getUserOverallInvestment(accessToken: string) {
    return investmentsApi.getUserOverallInvestment(this.cfg(accessToken));
  }

  async getPlatformVolume(accessToken?: string) {
    return investmentsApi.getPlatformVolume(this.cfg(accessToken));
  }

  async getUserInvestedLivePoolsCount(accessToken: string) {
    return investmentsApi.getUserInvestedLivePoolsCount(this.cfg(accessToken));
  }

  async calculateUserOpenInterest(accessToken: string) {
    return investmentsApi.calculateUserOpenInterest(this.cfg(accessToken));
  }

  // ─── Price Data ──────────────────────────────────────────────────────────────

  async getPriceData(params: PriceDataParams, accessToken?: string) {
    return priceDataApi.getPriceData(params, this.cfg(accessToken));
  }

  // ─── Pool Reviews ────────────────────────────────────────────────────────────

  async addReview(params: AddReviewParams, accessToken: string) {
    return poolReviewsApi.addReview(params, this.cfg(accessToken));
  }

  async getUserReviews(accessToken: string) {
    return poolReviewsApi.getUserReviews(this.cfg(accessToken));
  }

  async getPoolsByCreatorReviews(accessToken: string) {
    return poolReviewsApi.getPoolsByCreatorReviews(this.cfg(accessToken));
  }

  // ─── Orders ──────────────────────────────────────────────────────────────────

  async getUserOrders(params: GetUserOrdersParams, accessToken: string) {
    return ordersApi.getUserOrders(params, this.cfg(accessToken));
  }

  async getOrderBook(params: OrderBookParams, accessToken?: string) {
    return ordersApi.getOrderBook(params, this.cfg(accessToken));
  }

  async getUserOrderByPoolId(params: GetUserOrderByPoolIdParams, accessToken: string) {
    return ordersApi.getUserOrderByPoolId(params, this.cfg(accessToken));
  }

  async getOrdersListingByPool(params: OrdersListingByPoolParams, accessToken?: string) {
    return ordersApi.getOrdersListingByPool(params, this.cfg(accessToken));
  }

  async getOrderById(params: { orderId: string }, accessToken: string) {
    return ordersApi.getOrderById(params, this.cfg(accessToken));
  }

  // ─── Points ──────────────────────────────────────────────────────────────────

  async addUserPoints(params: AddUserPointsParams, accessToken: string) {
    return pointsApi.addUserPoints(params, this.cfg(accessToken));
  }

  async getUserPoints(accessToken: string) {
    return pointsApi.getUserPoints(this.cfg(accessToken));
  }

  async userSuccessfulOnboarding(params: UserOnboardingParams, accessToken: string) {
    return pointsApi.userSuccessfulOnboarding(params, this.cfg(accessToken));
  }

  async getUserPointsGraph(params: PointsGraphParams, accessToken: string) {
    return pointsApi.getUserPointsGraph(params, this.cfg(accessToken));
  }

  // ─── Notifications ───────────────────────────────────────────────────────────

  async getNotifications(params: GetNotificationsParams, accessToken: string) {
    return notificationsApi.getNotifications(params, this.cfg(accessToken));
  }

  async markAllNotificationsAsRead(accessToken: string) {
    return notificationsApi.markAllNotificationsAsRead(this.cfg(accessToken));
  }

  async markNotificationAsRead(params: MarkNotificationAsReadParams, accessToken: string) {
    return notificationsApi.markNotificationAsRead(params, this.cfg(accessToken));
  }

  // ─── Rain Burn ───────────────────────────────────────────────────────────────

  async getTotalBurned(accessToken?: string) {
    return rainBurnApi.getTotalBurned(this.cfg(accessToken));
  }

  async getBurnPerPool(params: RainBurnPerPoolParams, accessToken?: string) {
    return rainBurnApi.getBurnPerPool(params, this.cfg(accessToken));
  }

  // ─── Dispute ─────────────────────────────────────────────────────────────────

  async createDisputeMessage(params: CreateDisputeMessageParams, accessToken: string) {
    return disputeApi.createDisputeMessage(params, this.cfg(accessToken));
  }

  async getPoolDisputeConvo(params: GetPoolDisputeConvoParams, accessToken?: string) {
    return disputeApi.getPoolDisputeConvo(params, this.cfg(accessToken));
  }

  // ─── Follow ──────────────────────────────────────────────────────────────────

  async toggleFollow(params: FollowToggleParams, accessToken: string) {
    return followApi.toggleFollow(params, this.cfg(accessToken));
  }

  async checkFollow(params: FollowCheckParams, accessToken: string) {
    return followApi.checkFollow(params, this.cfg(accessToken));
  }

  async getFollowers(params: FollowListParams, accessToken?: string) {
    return followApi.getFollowers(params, this.cfg(accessToken));
  }

  async getFollowing(params: FollowListParams, accessToken?: string) {
    return followApi.getFollowing(params, this.cfg(accessToken));
  }

  async getFollowStats(params: FollowStatsParams, accessToken?: string) {
    return followApi.getFollowStats(params, this.cfg(accessToken));
  }
}
