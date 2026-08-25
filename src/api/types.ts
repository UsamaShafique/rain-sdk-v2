// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiConfig {
  apiUrl: string;
  accessToken?: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  details?: unknown;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  _id: string;
  walletAddress: string;
  name?: string;
  bio?: string;
  profilePic?: string;
  twitterLink?: string;
  instagramLink?: string;
  discordLink?: string;
  telegramLink?: string;
  facebookLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileUpdateParams {
  name?: string;
  bio?: string;
  profilePic?: string;
  twitterLink?: string;
  instagramLink?: string;
  discordLink?: string;
  telegramLink?: string;
  facebookLink?: string;
}

export interface UserHistoryParams {
  limit?: number;
  offset?: number;
}

export interface UserHistoryItem {
  action: string;
  poolQuestion?: string;
  poolToken?: Record<string, unknown>;
  optionName?: string;
  amount?: number;
  txHash?: string;
  createdAt?: string;
}

export interface UserHistoryResponse {
  totalPoints: number;
  followedTwitter: boolean;
  joinedTomi: boolean;
  history: UserHistoryItem[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface CreateCommentParams {
  comment: string;
  poolId: string;
  parentCommentId?: string;
}

export interface CommentsListingParams {
  poolId: string;
  limit?: number;
  offset?: number;
}

export interface UpdateCommentParams {
  commentId: string;
  comment: string;
}

export interface CommentCountParams {
  poolId: string;
}

// ─── Pools ────────────────────────────────────────────────────────────────────

export interface PoolOption {
  optionName: string;
  optionImage?: string;
  choiceIndex?: number;
}

export interface PoolToken {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenName?: string;
  tokenLogo?: string;
}

export type PoolStatus =
  | 'New'
  | 'Live'
  | 'Closing_Soon'
  | 'Pending_Finalization'
  | 'Waiting_for_Result'
  | 'Dispute_Window_Open'
  | 'Under_Dispute'
  | 'Appeal_Window_Open'
  | 'Under_Appeal'
  | 'Closed';

export interface CreatePoolParams {
  question: string;
  isPrivate: boolean;
  contractAddress: string;
  poolTrxHash: string;
  ipfsURL?: string;
  poolDescription?: string;
  tags?: string[];
  options: { optionName: string }[];
  startDate: string;
  endDate: string;
  liquidityMax: number;
}

export interface PublicPoolsParams {
  limit?: number;
  offset?: number;
  tag?: string;
  sortBy?: string;
  status?: PoolStatus;
}

export interface PrivatePoolsParams {
  limit?: number;
  offset?: number;
  tag?: string;
  status?: PoolStatus;
}

export interface PoolListingByCreatorParams {
  limit: number;
  offset: number;
  filter?: 'privatePools' | 'publicPools';
}

export interface VerifyAccessCodeParams {
  poolId: string;
  accessCode: string;
}

export interface PoolTotalParticipantsParams {
  poolId: string;
}

export interface SearchPoolParams {
  question: string;
}

export interface TrendingTagsParams {
  limit?: number;
}

export interface RelatedPoolsParams {
  poolId: string;
  limit?: number;
  offset?: number;
}

export interface UpdateStreamingParams {
  poolId: string;
  action: 'start' | 'stop';
  videoStreamingID?: string;
}

export interface UpdatePoolResolutionTimeParams {
  poolId: string;
  resolutionTime?: string;
}

export interface FindPoolFallbackParams {
  question: string;
  isPrivate: boolean;
  poolDescription?: string;
  options: { optionName: string }[];
  startDate: string;
  endDate: string;
  tags?: string | string[];
}

export interface SignOraclesExtendTimeParams {
  contractAddress: string;
  walletAddress: string;
}

// ─── Investments ──────────────────────────────────────────────────────────────

export interface UserTotalInvestmentParams {
  poolId: string;
}

export interface OptionsTotalVolumeParams {
  poolId: string;
}

export interface PoolActivityParams {
  poolId: string;
  limit?: number;
  offset?: number;
}

export interface TopHoldersParams {
  poolId: string;
  subPoolIndex: number;
  limit?: number;
  offset?: number;
}

export interface UserInvestedPoolsParams {
  limit?: number;
  offset?: number;
}

export interface InvestmentVolumeGraphParams {
  timeframe: 'day' | 'week' | 'month';
}

export interface UserPnlGraphParams {
  timeframe: 'day' | 'week' | 'month' | 'all';
}

export interface TopWinnersLosersParams {
  timeFilter?: 'all' | 'day' | 'week' | 'month';
}

export interface PnlByPoolIdParams {
  poolId: string;
}

export interface UserPositionsParams {
  poolId: string;
  subPoolIndex: number;
}

export interface OpenPositionsParams {
  poolId: string;
}

export interface UserSharePositionsParams {
  poolId: string;
}

export interface SearchInvestedPoolsParams {
  question: string;
  status?: 'all' | 'active' | 'closed' | 'New' | 'Live' | 'Waiting_for_Result' | 'Under_Dispute' | 'Under_Appeal' | 'Closed' | 'Closing_Soon' | 'Pending_Finalization' | 'Dispute_Window_Open' | 'Appeal_Window_Open';
  sortBy?: 'value' | 'recent';
  limit?: number;
}

// ─── Price Data ───────────────────────────────────────────────────────────────

export interface PriceDataParams {
  contractAddress: string;
  side: 1 | 2; // 1 = YES, 2 = NO
  filter?: '1H' | '6H' | '1D' | '1W' | '1M' | 'ALL';
}

// ─── Pool Reviews ─────────────────────────────────────────────────────────────

export interface AddReviewParams {
  poolId: string;
  rating: number;
  review?: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CreateOrderParams {
  pool: string;
  quantity: number;
  totalPrice: number;
  externalID: string;
  subPool: string;
  subPoolIndex: number;
  side: 1 | 2;
  orderType: 'buy' | 'sell';
}

export interface GetUserOrdersParams {
  filter?: 'open' | 'orderHistory';
  limit?: number;
  offset?: number;
}

export interface OrderBookParams {
  pool: string;
  limit?: number;
  offset?: number;
}

export interface GetUserOrderByPoolIdParams {
  poolId: string;
  filter?: 'open' | 'orderHistory';
}

export interface OrdersListingByPoolParams {
  pool: string;
  limit?: number;
  offset?: number;
}

// ─── Points ───────────────────────────────────────────────────────────────────

export type PointsEventType =
  | 'deposit'
  | 'withdraw'
  | 'trade'
  | 'add_liquidity'
  | 'open_market'
  | 'invite'
  | 'follow_twitter'
  | 'join_tomi';

export interface AddUserPointsParams {
  eventType: PointsEventType;
  value: number;
  points: number;
  transactionHash: string;
}

export interface UserOnboardingParams {
  points: number;
  value: number;
  eventType: 'invite';
}

export interface PointsGraphParams {
  range?: 'day' | 'week' | 'month' | 'all';
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'unread' | 'read';
}

export interface MarkNotificationAsReadParams {
  id: string;
}

// ─── Dispute ──────────────────────────────────────────────────────────────────

export interface CreateDisputeMessageParams {
  pool: string;
  subPool: string;
  role: 'creator' | 'disputer' | 'proposer';
  messageType: 'text' | 'image' | 'video' | 'file' | 'youtube' | 'mixed';
  files?: (Blob | File)[];
  evidence: {
    question?: string;
    options: string[];
    evidenceType: 'photo' | 'video' | 'pdf' | 'youtube' | 'mixed';
    description?: string;
    source?: string;
    youtubeUrls?: string[];
    urls?: string[];
  };
}

export interface GetPoolDisputeConvoParams {
  poolId: string;
  subPool: string;
  limit?: number;
  offset?: number;
}

// ─── Follow ───────────────────────────────────────────────────────────────────

export interface FollowToggleParams {
  userId: string;
}

export interface FollowCheckParams {
  userId: string;
}

export interface FollowListParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface FollowStatsParams {
  userId: string;
}

// ─── Rain Burn ────────────────────────────────────────────────────────────────

export interface RainBurnPerPoolParams {
  poolId: string;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export interface ToggleBookmarkParams {
  poolId: string;
}

export interface GetBookmarksParams {
  page?: number;
  limit?: number;
}

export interface CheckBookmarkParams {
  poolId: string;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export type LeaderboardBoard = 'profit' | 'correct_calls';
export type LeaderboardWindow = 'all_time' | 'monthly';

export interface LeaderboardParams {
  /** Ranking to serve: net realized PnL, or the weighted correct-calls score. */
  board: LeaderboardBoard;
  /** `all_time` (default) or the current UTC calendar month. */
  window?: LeaderboardWindow;
  /** Market category (case-insensitive). Omit for the global board. Unknown categories return an empty board. */
  category?: string;
  /** Entries to return, up to the stored cap of 100. Default 10. */
  limit?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  walletAddress: string | null;
  eoaWalletAddress: string | null;
  /** The ranking key. On `profit`, dollars × 1e6 (divide by 1,000,000 to display); on `correct_calls`, an unscaled weight. */
  score: number;
  positions: number;
  /** Net realized PnL in dollars × 1e6. Present on both boards. */
  profit: number;
  /** Sum of `1 − entryPrice` over winning positions — a weight, not a count. Present on both boards. */
  correctCalls: number;
  /** Resolved directional positions — the denominator of `winRate`. */
  trades: number;
  wins: number;
  /** `wins / trades`, a fraction in [0,1]. */
  winRate: number;
  badge: 'none' | 'blue' | 'gold';
  /** Crowns held on this board and category — the row's crown indicator. */
  categoryCrowns: number;
  /** Newest crowned month in this bucket, `YYYY-MM` (UTC), or null. */
  lastCrownPeriod: string | null;
  /** Crowns held across all boards and categories. */
  crownCount: number;
  marketScore: number;
  costScore: number;
}

export interface LeaderboardData {
  board: LeaderboardBoard;
  window: LeaderboardWindow;
  /** Upper-cased matched key, or null for the global board. */
  category: string | null;
  /** Display spelling of the matched category, or null. */
  categoryLabel: string | null;
  /** `YYYY-MM` (UTC) on the monthly window; null on all-time. */
  period: string | null;
  limit: number;
  /** Users ranked in total (before the stored cap). */
  totalRanked: number;
  /** Entry-price basis the correct-calls board was ranked on: `market` or `cost`. */
  priceBasis: 'market' | 'cost';
  entries: LeaderboardEntry[];
  /** When the cron last rebuilt this board; null means never. */
  lastUpdatedAt: string | null;
}

export interface LeaderboardCategory {
  /** Upper-cased key — pass this back as `category`. */
  category: string;
  /** First-seen spelling, for display. */
  label: string;
}

export interface LeaderboardSearchParams {
  /** Wallet address, address fragment (with or without 0x, prefix/middle/tail), or user id. Case-insensitive substring match. */
  q: string;
  /** Board to search: `profit` or `correct_calls`. */
  board: LeaderboardBoard;
  /** `all_time` (default) or the current UTC calendar month. */
  window?: LeaderboardWindow;
  /** Market category (case-insensitive). Omit for the global board. */
  category?: string;
  /** Results to return, up to 50. Default 10. */
  limit?: number;
}

export interface TraderRecentTradesParams {
  /** The trader's user id, as returned in leaderboard entries. */
  userId: string;
  /** Rendered rows to return (a trade carrying more than one side flattens into more than one line), up to 25. Default 5. */
  limit?: number;
}

export interface TraderRecentTrade {
  /** Rendered form of `transactionType`: `Buy` or `Sell`. */
  action: 'Buy' | 'Sell';
  transactionType: string;
  origin: 'enter' | 'orderFill';
  transactionHash: string;
  tradedAt: string;
  poolId: string;
  question: string | null;
  poolImage: string | null;
  subPoolId: string | null;
  /** The sub-market — e.g. "Match winner". */
  subQuestion: string | null;
  /** 1 = YES, 2 = NO */
  side: number;
  optionName: string;
  shares: number;
  /** Collateral paid, in dollars × 1e6 (divide by 1,000,000 to display). */
  amountUSD: number;
  /** Collateral paid per share, in (0,1). Null when the recorded ratio is not a price (e.g. a 1:1 AMM entry). */
  pricePerShare: number | null;
  /** `pricePerShare` in cents, for the "9c" label. */
  priceCents: number | null;
  /** `open` = market not resolved; `pending` = won but unclaimed (no PnL yet, never booked as a loss); `settled` = realized. */
  status: 'open' | 'pending' | 'settled';
  /** Always `position` — PnL is per (pool, subPool), not per fill. */
  pnlScope: string;
  /** Realized PnL of the POSITION this trade belongs to, in dollars × 1e6. Null until settled. */
  pnlUSD: number | null;
  /** Resolved-but-unclaimed winnings of the position, in dollars × 1e6. */
  pendingUSD?: number;
  /** Whether the position won, once resolved. */
  won?: boolean;
}

export interface TraderRecentTradesData {
  userId: string;
  limit: number;
  /** Most recent directional trades, newest first. */
  trades: TraderRecentTrade[];
}

export interface LeaderboardSearchData {
  board: LeaderboardBoard;
  window: LeaderboardWindow;
  category: string | null;
  /** `YYYY-MM` (UTC) on the monthly window; null on all-time. */
  period: string | null;
  query: string;
  /** Board entries the term matched, before `limit`. */
  matched: number;
  /** Board rows searched — the stored depth. With `matched: 0`, lets a client say "not in the top N" rather than "no such trader". */
  searchedTop: number;
  /** Users ranked on this board in total. */
  totalRanked: number;
  lastUpdatedAt: string | null;
  /** Matching board entries — the same objects `getLeaderboard` returns, in rank order. */
  results: LeaderboardEntry[];
}
