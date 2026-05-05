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

// ─── Price Data ───────────────────────────────────────────────────────────────

export interface PriceDataParams {
  contractAddress: string;
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
  role: 'creator' | 'disputer';
  messageType: 'text' | 'image' | 'video' | 'file' | 'youtube';
  file?: Blob | File;
  evidence: {
    question: string;
    options: string[];
    evidenceType: 'photo' | 'video' | 'pdf' | 'youtube';
    description?: string;
    source?: string;
    youtubeUrl?: string;
  };
}

export interface GetPoolDisputeConvoParams {
  poolId: string;
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
