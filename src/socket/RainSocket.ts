import { io, Socket } from 'socket.io-client';

export type RainSocketEvent =
  | 'enter-option'
  | 'exit-option'
  | 'liquidity'
  | 'split'
  | 'merge'
  | 'remove-liquidity'
  | 'sync-price'
  | 'order-created'
  | 'order-cancelled'
  | 'order-filled'
  | 'pool-closed'
  | 'pool-reverted'
  | 'pool-token-set'
  | 'streamingStatusChanged'
  | 'winner'
  | 'winner-proposer'
  | 'reveal-winner-available'
  | 'dispute-opened'
  | 'oracle-created'
  | 'dispute-time-extented'
  | 'appeal-opened'
  | 'appeal-winner-calculated'
  | 'dispute-winner'
  | 'appeal-winner'
  | 'claim-reward'
  | 'dispute-refund'
  | 'appeal-refund'
  | 'resolution-refund'
  | 'resolver-reward'
  | 'notifications'
  | 'pool';

export interface EnterOptionEventData {
  enterOption: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface ExitOptionEventData {
  exitOption: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface LiquidityEventData {
  enterLiquidity: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface SplitEventData {
  split: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface MergeEventData {
  merge: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface RemoveLiquidityEventData {
  removeLiquidity: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface SyncPriceEventData {
  prices: Array<{
    side: number;
    price: number;
    percentage: number;
    subPoolIndex: number;
  }>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface OrderCreatedEventData {
  order: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface OrderCancelledEventData {
  order: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface OrderFilledEventData {
  filledOrder: Record<string, any>;
  pendingOrder?: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface PoolClosedEventData {
  pool: Record<string, any>;
  subPool?: Record<string, any>;
}

export interface PoolEventData {
  pool: Record<string, any>;
  subMarkets?: Record<string, any>[];
}

export interface WinnerEventData {
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface DisputeOpenedEventData {
  subPool: Record<string, any>;
  eventType: string;
}

export interface OracleCreatedEventData {
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface AppealOpenedEventData {
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface DisputeWinnerEventData {
  subPool: Record<string, any>;
  eventType: string;
}

export interface AppealWinnerEventData {
  subPool: Record<string, any>;
  eventType: string;
  winnerFinalized: boolean;
}

export interface ClaimRewardEventData {
  claimReward: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export interface DisputeRefundEventData {
  claimReward: Record<string, any>;
  pool: Record<string, any>;
  subPool: Record<string, any>;
}

export class RainSocket {
  private socket: Socket | null = null;
  private url: string;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to the Socket.IO server
   */
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('[RainSocket] Connected:', this.socket?.id);
      // Re-register all listeners after reconnect
      for (const [channel, callbacks] of this.listeners.entries()) {
        for (const cb of callbacks) {
          this.socket!.on(channel, cb);
        }
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[RainSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[RainSocket] Connection error:', err.message);
    });
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Subscribe to an event for a specific pool
   * @returns unsubscribe function
   */
  on(event: RainSocketEvent, poolId: string, callback: (data: any) => void): () => void {
    const channel = `${event}/${poolId}`;
    return this.onChannel(channel, callback);
  }

  /**
   * Subscribe to a global event (no poolId)
   * @returns unsubscribe function
   */
  onGlobal(event: 'pool', callback: (data: PoolEventData) => void): () => void {
    return this.onChannel(event, callback);
  }

  /**
   * Subscribe to a raw channel name
   * @returns unsubscribe function
   */
  onChannel(channel: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(callback);

    if (this.socket) {
      this.socket.on(channel, callback);
    }

    return () => {
      this.listeners.get(channel)?.delete(callback);
      if (this.socket) {
        this.socket.off(channel, callback);
      }
    };
  }

  // ─── Typed helpers ──────────────────────────────────────────────────────────

  onEnterOption(poolId: string, callback: (data: EnterOptionEventData) => void): () => void {
    return this.on('enter-option', poolId, callback);
  }

  onExitOption(poolId: string, callback: (data: ExitOptionEventData) => void): () => void {
    return this.on('exit-option', poolId, callback);
  }

  onLiquidity(poolId: string, callback: (data: LiquidityEventData) => void): () => void {
    return this.on('liquidity', poolId, callback);
  }

  onSplit(poolId: string, callback: (data: SplitEventData) => void): () => void {
    return this.on('split', poolId, callback);
  }

  onMerge(poolId: string, callback: (data: MergeEventData) => void): () => void {
    return this.on('merge', poolId, callback);
  }

  onRemoveLiquidity(poolId: string, callback: (data: RemoveLiquidityEventData) => void): () => void {
    return this.on('remove-liquidity', poolId, callback);
  }

  onSyncPrice(poolId: string, callback: (data: SyncPriceEventData) => void): () => void {
    return this.on('sync-price', poolId, callback);
  }

  onOrderCreated(poolId: string, callback: (data: OrderCreatedEventData) => void): () => void {
    return this.on('order-created', poolId, callback);
  }

  onOrderCancelled(poolId: string, callback: (data: OrderCancelledEventData) => void): () => void {
    return this.on('order-cancelled', poolId, callback);
  }

  onOrderFilled(poolId: string, callback: (data: OrderFilledEventData) => void): () => void {
    return this.on('order-filled', poolId, callback);
  }

  onPoolClosed(poolId: string, callback: (data: PoolClosedEventData) => void): () => void {
    return this.on('pool-closed', poolId, callback);
  }

  onPoolReverted(poolId: string, callback: (data: any) => void): () => void {
    return this.on('pool-reverted', poolId, callback);
  }

  onPoolTokenSet(poolId: string, callback: (data: any) => void): () => void {
    return this.on('pool-token-set', poolId, callback);
  }

  onStreamingStatusChanged(poolId: string, callback: (data: any) => void): () => void {
    return this.on('streamingStatusChanged', poolId, callback);
  }

  onNewPool(callback: (data: PoolEventData) => void): () => void {
    return this.onGlobal('pool', callback);
  }

  // ─── Dispute & Appeal events ────────────────────────────────────────────────

  onWinner(poolId: string, callback: (data: WinnerEventData) => void): () => void {
    return this.on('winner', poolId, callback);
  }

  onWinnerProposer(poolId: string, callback: (data: WinnerEventData) => void): () => void {
    return this.on('winner-proposer', poolId, callback);
  }

  onRevealWinnerAvailable(poolId: string, callback: (data: { subPoolId: string }) => void): () => void {
    return this.on('reveal-winner-available', poolId, callback);
  }

  onDisputeOpened(poolId: string, callback: (data: DisputeOpenedEventData) => void): () => void {
    return this.on('dispute-opened', poolId, callback);
  }

  onOracleCreated(poolId: string, callback: (data: OracleCreatedEventData) => void): () => void {
    return this.on('oracle-created', poolId, callback);
  }

  onDisputeTimeExtended(poolId: string, callback: (data: { pool: Record<string, any>; subPool: Record<string, any> }) => void): () => void {
    return this.on('dispute-time-extented', poolId, callback);
  }

  onAppealOpened(poolId: string, callback: (data: AppealOpenedEventData) => void): () => void {
    return this.on('appeal-opened', poolId, callback);
  }

  onAppealWinnerCalculated(poolId: string, callback: (data: { subPool: Record<string, any> }) => void): () => void {
    return this.on('appeal-winner-calculated', poolId, callback);
  }

  onDisputeWinner(poolId: string, callback: (data: DisputeWinnerEventData) => void): () => void {
    return this.on('dispute-winner', poolId, callback);
  }

  onAppealWinner(poolId: string, callback: (data: AppealWinnerEventData) => void): () => void {
    return this.on('appeal-winner', poolId, callback);
  }

  onClaimReward(poolId: string, callback: (data: ClaimRewardEventData) => void): () => void {
    return this.on('claim-reward', poolId, callback);
  }

  /**
   * User-scoped claim reward event: claim-reward/{poolId}/{userId}
   */
  onUserClaimReward(poolId: string, userId: string, callback: (data: ClaimRewardEventData) => void): () => void {
    return this.onChannel(`claim-reward/${poolId}/${userId}`, callback);
  }

  onDisputeRefund(poolId: string, userId: string, callback: (data: DisputeRefundEventData) => void): () => void {
    return this.onChannel(`dispute-refund/${poolId}/${userId}`, callback);
  }

  onAppealRefund(poolId: string, userId: string, callback: (data: DisputeRefundEventData) => void): () => void {
    return this.onChannel(`appeal-refund/${poolId}/${userId}`, callback);
  }

  onResolutionRefund(poolId: string, userId: string, callback: (data: ClaimRewardEventData) => void): () => void {
    return this.onChannel(`resolution-refund/${poolId}/${userId}`, callback);
  }

  onResolverReward(poolId: string, userId: string, callback: (data: ClaimRewardEventData) => void): () => void {
    return this.onChannel(`resolver-reward/${poolId}/${userId}`, callback);
  }

  onNotifications(userId: string, callback: (data: any) => void): () => void {
    return this.onChannel(`notifications/${userId}`, callback);
  }
}
