# Rain SDK V2

TypeScript SDK for the Rain prediction markets protocol on Arbitrum One. Provides transaction builders for market creation, trading, liquidity management, order book operations, dispute resolution, and smart account (Account Abstraction) support.

## Installation

```bash
npm install rain-sdk-v2 viem
```

### Optional (for Smart Account / Account Abstraction)

```bash
npm install @alchemy/aa-core @account-kit/infra @account-kit/wallet-client
```

## Quick Start

```typescript
import { Rain, RainAA, TradingModel, OptionSide } from 'rain-sdk-v2';
import { createWalletClient, custom, parseUnits, parseEther } from 'viem';
import { arbitrum } from 'viem/chains';

// Initialize SDK
const rain = new Rain({
  environment: 'development', // 'development' | 'stage' | 'production'
  rpcUrl: 'https://arb1.arbitrum.io/rpc', // optional, uses random public RPC if omitted
});

// Get environment config
const config = rain.getEnvironmentConfig();
console.log(config.market_factory_address); // Factory contract
console.log(config.tokens.usdt.address);    // USDT token address
console.log(config.tokens.rain.address);    // RAIN token address
console.log(config.tokens.usdt.decimals);   // 6
console.log(config.tokens.rain.decimals);   // 18

// Get token config by address
const tokenInfo = rain.getTokenConfig('0x...');
console.log(tokenInfo?.decimals, tokenInfo?.symbol);
```

---

## Classes

### `Rain`

Stateless class for building transactions and querying on-chain data. Does not require a wallet.

#### Constructor

```typescript
const rain = new Rain(config?: RainCoreConfig);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `environment` | `'development' \| 'stage' \| 'production'` | `'development'` | Target environment |
| `rpcUrl` | `string` | Random public RPC | Custom Arbitrum RPC URL |
| `apiUrl` | `string` | From environment | Custom API URL |

---

### `RainAA`

Stateful class for smart account (Account Abstraction) management with Alchemy gas sponsorship.

#### Constructor

```typescript
const rainAA = new RainAA(config: RainConfig);
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletClient` | `WalletClient` | Yes | Viem wallet client |
| `alchemyApiKey` | `string` | Yes | Alchemy API key |
| `paymasterPolicyId` | `string` | Yes | Alchemy paymaster policy ID |
| `chain` | `Chain` | Yes | Viem chain (e.g. `arbitrum`) |
| `rpcUrl` | `string` | No | Custom RPC URL |

#### Methods

##### `connect()`

Initializes the smart account. Returns the smart account address.

```typescript
const smartAccountAddress = await rainAA.connect();
```

##### `sendTransaction(rawTx: RawTransaction)`

Sends a transaction from the smart account (gas-sponsored).

```typescript
const hash = await rainAA.sendTransaction(rawTx);
```

##### `disconnect()`

Resets the connection state.

```typescript
rainAA.disconnect();
```

##### `address` (getter)

Returns the smart account address. Throws if not connected.

##### `client` (getter)

Returns the smart wallet client instance. Throws if not connected.

---

## Transaction Builders

All transaction builders return `RawTransaction` (or `RawTransaction[]` for multi-step operations):

```typescript
interface RawTransaction {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
}
```

---

### Market Creation

#### `buildCreateMarketTx(params: CreateMarketTxParams): Promise<RawTransaction[]>`

Creates a new prediction market. Returns approval TX (if needed) + createPool TX.

```typescript
const config = rain.getEnvironmentConfig();

// Create market with USDT (6 decimals)
const txs = await rain.buildCreateMarketTx({
  marketQuestion: 'Will ETH reach $5000 by end of 2025?',
  marketOptions: ['Yes', 'No'],
  marketTags: ['crypto'],
  marketDescription: 'Prediction on ETH price target',
  isPublic: true,
  isPublicPoolResolverAi: true, // true = AI resolver, false = manual resolver
  creator: '0x...', // smart account or EOA address
  startTime: BigInt(Math.floor(Date.now() / 1000) + 120), // 2 min from now
  endTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24h from now
  no_of_options: 2n,
  disputeTimer: 259200, // oracle end time duration in seconds (e.g. 259200 = 3 days)
  inputAmountWei: parseUnits('10', 6), // 10 USDT
  barValues: [50, 50], // probability distribution (0-100, sums to 100)
  initialYesPrices: [500000000000000000n, 500000000000000000n], // optional, 1e18 scale (50% = 5e17)
  baseToken: config.tokens.usdt.address, // USDT
  tradingModel: TradingModel.AMM, // AMM = 0, OrderBook = 1
  marketImage: 'https://cdn.example.com/market-image.png',
});

// Create market with RAIN token (18 decimals)
const txsRain = await rain.buildCreateMarketTx({
  ...params,
  inputAmountWei: parseUnits('10', 18), // 10 RAIN
  baseToken: config.tokens.rain.address, // RAIN token
});

// Approval for USDT: liquidity + (oracleFixedFeePerOption * numberOfOptions)
// Approval for RAIN: liquidity + (numberOfOptions * 20% of liquidity)
// e.g. 1000 RAIN with 5 options → 1000 + (5 * 200) = 2000 RAIN approval
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketQuestion` | `string` | The market question |
| `marketOptions` | `string[]` | Option labels (2-26 options) |
| `marketTags` | `string[]` | Tags (1-3) |
| `marketDescription` | `string` | Description |
| `isPublic` | `boolean` | Public market |
| `isPublicPoolResolverAi` | `boolean` | `true` for AI resolver, `false` for manual |
| `creator` | `0x${string}` | Creator/pool owner address |
| `startTime` | `bigint` | Unix timestamp (seconds) |
| `endTime` | `bigint` | Unix timestamp (seconds) |
| `no_of_options` | `bigint` | Number of options |
| `inputAmountWei` | `bigint` | Initial liquidity in base token wei |
| `disputeTimer` | `number` | Oracle end time duration in seconds (e.g. 259200 = 3 days). Auto-set from environment config |
| `barValues` | `number[]` | Probability distribution (0-100 scale) |
| `initialYesPrices` | `bigint[]` | *(Optional)* Initial Yes prices per option in 1e18 scale (e.g. `500000000000000000n` = 50%). Defaults to 50% for both AMM and OrderBook |
| `baseToken` | `0x${string}` | Base token address (USDT or RAIN) |
| `tradingModel` | `TradingModel` | `AMM (0)` or `OrderBook (1)` |
| `marketImage` | `string` | Market image URL (required) |

---

### Trading

#### `buildEnterOptionTx(params): Promise<RawTransaction[]>`

Buy shares of an option (AMM trade). Automatically reads the market's base token, checks allowance, includes approval TX if needed, and calculates slippage protection via on-chain `getEntryShares`.

```typescript
const txs = await rain.buildEnterOptionTx({
  marketContractAddress: '0x...',
  selectedOption: 1n, // 1-based option index
  optionSide: OptionSide.Yes, // Yes = 1, No = 2
  buyAmountInWei: parseUnits('5', 6), // 5 USDT (or parseUnits('5', 18) for RAIN)
  walletAddress: '0x...', // user's wallet address
  slippageTolerance: 5n, // optional, default 5% — percentage tolerance for minSharesOut
  deadline: 600n, // optional, default 600 (10 min) — duration in seconds
});
// Returns [approveTx?, enterOptionTx]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `selectedOption` | `bigint` | Option index (1-based) |
| `optionSide` | `OptionSide` | `Yes (1)` or `No (2)` |
| `buyAmountInWei` | `bigint` | Amount in base token wei |
| `walletAddress` | `0x${string}` | User's wallet address (for allowance check) |
| `minSharesOut` | `bigint` | *(Optional)* Minimum shares to receive. Auto-calculated from `getEntryShares` with slippage if not set |
| `slippageTolerance` | `bigint` | *(Optional)* Slippage percentage (e.g. `5n` = 5%). Default: 5% |
| `deadline` | `bigint` | *(Optional)* Duration in seconds (e.g. `600n` = 10 min). Default: 600 |

> **Note:** Approval is handled automatically. The SDK reads `baseToken` from the market contract and checks allowance before building transactions. Slippage protection is auto-calculated: the SDK calls `getEntryShares` on-chain to get expected shares, then applies the slippage tolerance.

---

#### `buildSellOptionTx(params): Promise<RawTransaction>`

Market-sell shares of an option into the resting buy order book. No approval needed (you're selling shares, not tokens). Slippage protection is auto-calculated from on-chain `getCurrentPrice`.

```typescript
const tx = await rain.buildSellOptionTx({
  marketContractAddress: '0x...',
  selectedOption: 1n, // 1-based option index
  optionSide: OptionSide.Yes, // Yes = 1, No = 2
  sharesAmount: parseUnits('10', 6), // shares to sell
  slippageTolerance: 5n, // optional, default 5%
  deadline: 600n, // optional, default 600 (10 min) — duration in seconds
});
// Returns a single RawTransaction (no approval needed)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `selectedOption` | `bigint` | Option index (1-based) |
| `optionSide` | `OptionSide` | `Yes (1)` or `No (2)` |
| `sharesAmount` | `bigint` | Number of shares to sell |
| `minAmountOut` | `bigint` | *(Optional)* Minimum base tokens to receive. Auto-calculated from `getCurrentPrice` with slippage if not set |
| `slippageTolerance` | `bigint` | *(Optional)* Slippage percentage (e.g. `5n` = 5%). Default: 5% |
| `deadline` | `bigint` | *(Optional)* Duration in seconds (e.g. `600n` = 10 min). Default: 600 |

---

### Split & Merge

#### `buildSplitTx(params): Promise<RawTransaction[]>`

Split base tokens into equal Yes + No shares for an option. Automatically checks allowance and includes approval TX if needed.

```typescript
const txs = await rain.buildSplitTx({
  marketContractAddress: '0x...',
  option: 1n,
  amount: parseUnits('5', 6), // 5 USDT -> 5 Yes shares + 5 No shares
  walletAddress: '0x...', // user's wallet address
});
// Returns [approveTx?, splitTx]
```

> **Note:** Approval is handled automatically.

#### `buildMergeTx(params: MergeTxParams): RawTransaction`

Merge equal Yes + No share pairs back into base tokens.

```typescript
const tx = rain.buildMergeTx({
  marketContractAddress: '0x...',
  option: 1n,
  amount: 5000000n, // raw shares amount (from getUserOptionShares)
});
```

> **Note:** No approval needed. Burns your shares and returns base token.

---

### Liquidity

#### `buildAddLiquidityTx(params): Promise<RawTransaction[]>`

Add liquidity to a specific option. Automatically checks allowance, includes approval TX if needed, and calculates slippage protection from on-chain AMM reserves.

```typescript
const txs = await rain.buildAddLiquidityTx({
  marketContractAddress: '0x...',
  option: 1n,
  totalAmountInWei: parseUnits('10', 6), // 10 USDT
  walletAddress: '0x...', // user's wallet address
  slippageTolerance: 5n, // optional, default 5%
  deadline: 600n, // optional, default 600 (10 min) — duration in seconds
});
// Returns [approveTx?, addLiquidityTx]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `option` | `bigint` | Option index (1-based) |
| `totalAmountInWei` | `bigint` | Amount in base token wei |
| `walletAddress` | `0x${string}` | User's wallet address (for allowance check) |
| `minYesToDeposit` | `bigint` | *(Optional)* Min yes tokens to deposit. Auto-calculated from reserves if not set |
| `minNoToDeposit` | `bigint` | *(Optional)* Min no tokens to deposit. Auto-calculated from reserves if not set |
| `slippageTolerance` | `bigint` | *(Optional)* Slippage percentage (e.g. `5n` = 5%). Default: 5% |
| `deadline` | `bigint` | *(Optional)* Duration in seconds (e.g. `600n` = 10 min). Default: 600 |

> **Note:** Approval is handled automatically. Slippage protection is auto-calculated from `ammYesReserve`/`ammNoReserve` proportionally.

#### `buildRemoveLiquidityTx(params: RemoveLiquidityTxParams): Promise<RawTransaction>`

Remove liquidity by burning LP shares. Automatically calculates slippage protection via on-chain `getRemovedLiquidity`.

```typescript
const lpShares = await rain.getUserOptionLPShares({
  marketContractAddress: '0x...',
  option: 1n,
  userAddress: '0x...',
});

const tx = await rain.buildRemoveLiquidityTx({
  marketContractAddress: '0x...',
  option: 1n,
  lpShares, // raw LP shares amount
  slippageTolerance: 5n, // optional, default 5%
  deadline: 600n, // optional, default 600 (10 min) — duration in seconds
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `option` | `bigint` | Option index (1-based) |
| `lpShares` | `bigint` | LP shares to remove |
| `minYesOut` | `bigint` | *(Optional)* Min yes tokens to receive. Auto-calculated from `getRemovedLiquidity` if not set |
| `minNoOut` | `bigint` | *(Optional)* Min no tokens to receive. Auto-calculated if not set |
| `slippageTolerance` | `bigint` | *(Optional)* Slippage percentage (e.g. `5n` = 5%). Default: 5% |
| `deadline` | `bigint` | *(Optional)* Duration in seconds (e.g. `600n` = 10 min). Default: 600 |

---

### Order Book

#### `buildPlaceBuyOrderTx(params): Promise<RawTransaction[]>`

Place a limit buy order. Automatically checks allowance and includes approval TX if needed.

```typescript
const txs = await rain.buildPlaceBuyOrderTx({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: OptionSide.Yes,
  price: parseEther('0.5'), // 50% price in 1e18 scale
  amount: parseUnits('10', 6), // 10 USDT
  walletAddress: '0x...', // user's wallet address
});
// Returns [approveTx?, placeBuyOrderTx]
```

> **Note:** Approval is handled automatically. Available when AMM pool is closed.

#### `buildPlaceSellOrderTx(params: PlaceSellOrderTxParams): RawTransaction`

Place a limit sell order.

```typescript
const tx = rain.buildPlaceSellOrderTx({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: OptionSide.Yes,
  price: parseEther('0.7'), // 70% price in 1e18 scale
  shares: 5000000n, // shares to sell (from getUserOptionShares)
});
```

> **Note:** No approval needed. Shares are escrowed by the contract.

#### `buildCancelBuyOrdersTx(params: CancelBuyOrdersTxParams): RawTransaction`

Cancel one or more buy orders.

```typescript
const tx = rain.buildCancelBuyOrdersTx({
  marketContractAddress: '0x...',
  option: 1n,
  optionSides: [1, 1], // Yes, Yes
  prices: [parseEther('0.5'), parseEther('0.6')],
  orderIDs: [1n, 2n], // from PlaceBuyOrder event
});
```

#### `buildCancelSellOrdersTx(params: CancelSellOrdersTxParams): RawTransaction`

Cancel one or more sell orders. Same interface as `buildCancelBuyOrdersTx`.

---

### Market Resolution

#### `buildClosePoolAITx(params: ClosePoolAITxParams): Promise<RawTransaction[]>`

Close a market pool with AI resolver. Returns approval (for resolver bond) + closePool TX.

```typescript
const txs = await rain.buildClosePoolAITx({
  marketContractAddress: '0x...',
  option: 1n,
});
```

#### `buildClosePoolManualTx(params: ClosePoolManualTxParams): Promise<RawTransaction[]>`

Close a market pool with manual resolver, proposing a winner side. Returns approval (for resolver bond) + closePool TX.

```typescript
const txs = await rain.buildClosePoolManualTx({
  marketContractAddress: '0x...',
  option: 1n,
  proposedWinner: 1, // 1 = Yes, 2 = No
});
```

#### `buildChooseWinnerTx(params: ChooseWinnerTxParams): RawTransaction`

Finalize the winner after pool is closed.

```typescript
const tx = rain.buildChooseWinnerTx({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: 1, // 1 = Yes, 2 = No
});
```

#### `buildCalculateWinnerTx(params: CalculateWinnerTxParams): Promise<RawTransaction>`

Calculate winner via the oracle resolver. Must be called before `claim`. Reads `optionResolver(option)` from the market and calls `calculateWinner()` on that resolver contract.

```typescript
const tx = await rain.buildCalculateWinnerTx({
  marketContractAddress: '0x...',
  option: 1n,
});
```

---

#### `buildExtendTimeTx(params: ExtendTimeTxParams): Promise<RawTransaction>`

Extend the resolution time of a market option. Requires a signature from the oracle backend (obtained via `signOraclesExtendTime` API). Reads `optionResolver(option)` from the market and calls `extendTime(newEndTime, signature)` on that resolver contract.

```typescript
// 1. Get the signature from the API
const signResult = await rain.signOraclesExtendTime(
  { contractAddress: '0x...', walletAddress: '0x...' },
  accessToken
);

// 2. Build the extend time transaction
const tx = await rain.buildExtendTimeTx({
  marketContractAddress: '0x...',
  option: 1n,
  newEndTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // extend by 1 day
  signature: signResult.signature, // from API
});
```

| Param | Type | Description |
|---|---|---|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `option` | `bigint` | Option index (1-based) |
| `newEndTime` | `bigint` | New end time as unix timestamp (seconds) |
| `signature` | `0x${string}` | Backend signature from `signOraclesExtendTime` |

---

### Claiming

#### `buildClaimTx(params: ClaimTxParams): RawTransaction`

Claim winnings after market resolution. Call `buildCalculateWinnerTx` first.

```typescript
const tx = rain.buildClaimTx({
  marketContractAddress: '0x...',
  option: 1n,
});
```

---

### Dispute / Appeal

#### `buildOpenDisputeTx(params: OpenDisputeTxParams): Promise<RawTransaction[]>`

Open a dispute (or appeal if dispute already exists). Returns approval (for dispute fee) + openDispute TX. The fee is read from `getDisputeAppealFee(option)`.

```typescript
const txs = await rain.buildOpenDisputeTx({
  marketContractAddress: '0x...',
  option: 1n,
});
```

> **Note:** Call once to open dispute. Call again (after dispute window) to appeal.

---

### Token Approval

#### `buildApprovalTx(params: ApproveTxParams): RawTransaction`

Build an ERC20 approve transaction.

```typescript
const tx = rain.buildApprovalTx({
  tokenAddress: config.tokens.usdt.address,
  spender: '0x...', // market contract address
  amount: parseUnits('100', 6), // 100 USDT
});
```

---

## Read Methods (On-Chain Queries)

### `getTokenAllowance(params): Promise<bigint>`

Check current ERC20 allowance.

```typescript
const allowance = await rain.getTokenAllowance({
  tokenAddress: config.tokens.usdt.address,
  owner: '0x...', // your address
  spender: '0x...', // market contract
});
```

### `getUserOptionLPShares(params): Promise<bigint>`

Get user's LP shares for a specific option.

```typescript
const lpShares = await rain.getUserOptionLPShares({
  marketContractAddress: '0x...',
  option: 1n,
  userAddress: '0x...',
});
```

### `getUserOptionShares(params): Promise<bigint>`

Get user's Yes or No shares for a specific option.

```typescript
const yesShares = await rain.getUserOptionShares({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: 1, // 1 = Yes, 2 = No
  userAddress: '0x...',
});
```

### `getOptionClaimed(params): Promise<boolean>`

Check if a user has already claimed winnings for a specific option.

```typescript
const claimed = await rain.getOptionClaimed({
  marketContractAddress: '0x...',
  option: 1n,
  userAddress: '0x...',
});
// true if already claimed, false otherwise
```

### `getEntryShares(params): Promise<{ returnedShares: bigint; expectedReward: bigint }>`

Calculate how many shares you'd receive for a given buy amount, plus the expected reward.

```typescript
const result = await rain.getEntryShares({
  marketContractAddress: '0x...',
  option: 1n,       // 1-based option index
  optionSide: 1,    // 1 = Yes, 2 = No
  amount: 1000000n, // buy amount in base token wei
});
// result.returnedShares = shares you'd receive
// result.expectedReward = expected reward amount
```

### `getDisputeWindow(params): Promise<bigint>`

Get the dispute window duration (in seconds) for a market contract.

```typescript
const window = await rain.getDisputeWindow({
  marketContractAddress: '0x...',
});
// window = dispute window in seconds (e.g. 7200n = 2 hours)
```

### `getDynamicPayout(params): Promise<bigint[]>`

Get the dynamic payout amounts for a user on a specific option. Returns an array of payout values per side.

```typescript
const payouts = await rain.getDynamicPayout({
  marketContractAddress: '0x...',
  userAddress: '0x...',
  option: 1n, // 1-based option index
});
// payouts = [yesPayoutWei, noPayoutWei]
```

### `getUserActiveBuyOrders(params): Promise<bigint>`

Get count of user's active buy orders.

```typescript
const count = await rain.getUserActiveBuyOrders({
  marketContractAddress: '0x...',
  userAddress: '0x...',
});
```

### `getUserActiveSellOrders(params): Promise<bigint>`

Get count of user's active sell orders.

```typescript
const count = await rain.getUserActiveSellOrders({
  marketContractAddress: '0x...',
  userAddress: '0x...',
});
```

### `getFirstBuyOrderPrice(params): Promise<bigint>`

Get the best (first) buy order price for an option/side.

```typescript
const price = await rain.getFirstBuyOrderPrice({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: 1, // Yes
});
// price is in 1e18 scale. 500000000000000000n = 0.5 = 50%
```

### `getFirstSellOrderPrice(params): Promise<bigint>`

Get the best (first) sell order price for an option/side.

### `getBuyOrdersAtPrice(params): Promise<OrderLevelInfo>`

Get order book info at a specific price level.

```typescript
const info = await rain.getBuyOrdersAtPrice({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: 1,
  price: parseEther('0.5'),
});
// { headIndex, tailIndex, count, isInitialized }
```

### `getSellOrdersAtPrice(params): Promise<OrderLevelInfo>`

Same as above for sell orders.

### `checkOrderExists(params): Promise<{ exists: boolean; index: bigint }>`

Check if a specific order exists.

```typescript
const result = await rain.checkOrderExists({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: 1,
  price: parseEther('0.5'),
  orderID: 1n,
});
```

---

## Authentication

### `login(params: LoginParams): Promise<LoginResult>`

Wallet-based login to the Rain backend.

#### `signLoginMessage(walletClient, walletAddress)`

Signs the lowercased wallet address using `personal_sign`. This signature is required for login.

```typescript
import { signLoginMessage } from 'rain-sdk-v2';

const walletClient = createWalletClient({ chain: arbitrum, transport: custom(window.ethereum) });
const signature = await signLoginMessage(walletClient, '0x...' as `0x${string}`);
```

#### `login(params)`

```typescript
const result = await rain.login({
  signature, // from signLoginMessage
  walletAddress: '0x...', // EOA address
  smartWalletAddress: '0x...', // Smart account address
  referredBy: 'CODE', // optional referral code
});

console.log(result.accessToken); // JWT token
console.log(result.userId); // Backend user ID
```

---

## Configuration

### `getEnvironmentConfig()`

Returns the current environment configuration.

```typescript
const config = rain.getEnvironmentConfig();
```

Returns:
| Field | Description |
|-------|-------------|
| `apiUrl` | Backend API URL |
| `market_factory_address` | Factory contract address |
| `dispute_initial_timer` | Dispute timer in seconds |
| `tokens.usdt` | USDT token config (`address`, `symbol`, `decimals`, `oracle_fixed_fee_per_option`) |
| `tokens.rain` | RAIN token config (`address`, `symbol`, `decimals`, `oracle_fixed_fee_per_option`) |

### `getTokenConfig(tokenAddress)`

Looks up token configuration by contract address. Returns `TokenConfig` or `null`.

```typescript
const tokenInfo = rain.getTokenConfig('0x...');
// { address, symbol, decimals, oracle_fixed_fee_per_option }
```

---

## Enums

### `TradingModel`

```typescript
enum TradingModel {
  AMM = 0,
  OrderBook = 1,
}
```

### `OptionSide`

```typescript
enum OptionSide {
  Yes = 1,
  No = 2,
}
```

---

## Environments

| Environment | API | Factory | USDT | RAIN |
|-------------|-----|---------|------|------|
| `development` | `https://dev2-api.rain.one` | `0xbbDd...f02f` | 6 decimals | 18 decimals |
| `stage` | `https://stg2-api.rain.one` | `0x16cc...628d` | 6 decimals | 18 decimals |
| `production` | `https://prod2-api.rain.one` | `0x38B3...C677` | 6 decimals | 18 decimals |

### Supported Tokens

Each environment includes token configs for both **USDT** (6 decimals) and **RAIN** (18 decimals). The SDK automatically handles decimal conversions for oracle fees and minimum liquidity validation based on the token used.

```typescript
const config = rain.getEnvironmentConfig();

// USDT
config.tokens.usdt.address   // Token contract address
config.tokens.usdt.decimals  // 6
config.tokens.usdt.symbol    // "USDTm" (dev) or "USD₮0" (stage/production)

// RAIN
config.tokens.rain.address   // Token contract address
config.tokens.rain.decimals  // 18
config.tokens.rain.symbol    // "RAIN"
```

---

## Typical Flow

```
1. Create Market (buildCreateMarketTx)
2. Wait for startTime to pass
3. Enter Option (buildEnterOptionTx) / Split (buildSplitTx)
4. Place Orders (buildPlaceBuyOrderTx / buildPlaceSellOrderTx)
5. Wait for endTime to pass
6. Close Pool (buildClosePoolAITx / buildClosePoolManualTx)
7. Calculate Winner (buildCalculateWinnerTx)
8. Check if claimed (getOptionClaimed) — optional
9. Claim (buildClaimTx)
```

If disputed:
```
6b. Open Dispute (buildOpenDisputeTx)
6c. Appeal (buildOpenDisputeTx again)
```

If extending time:
```
5b. Extend Time (signOraclesExtendTime API → buildExtendTimeTx)
```

---

## REST API Methods

The SDK wraps all Rain backend REST API endpoints. Each method requires `accessToken` for authenticated routes.

### Users

```typescript
// Find user by wallet address (public)
const user = await rain.findUserByWalletAddress({ walletAddress: '0x...' });

// Get authenticated user's profile
const profile = await rain.getUserProfile(accessToken);

// View another user's profile
const profile = await rain.viewUserProfile({ userId: '...' }, accessToken);

// Update profile
await rain.updateUserProfile({
  name: 'John',
  bio: 'Trader',
  profilePic: 'https://...',
  twitterLink: 'https://...',
}, accessToken);

// Get total user count (public)
const count = await rain.getUsersTotalCount();

// Remove profile picture
await rain.removeUserProfilePic(accessToken);

// Get user activity history (deposits, withdrawals, trades, rewards)
const history = await rain.getUserHistory({ limit: 20, offset: 1 }, accessToken);

// Check if access token is still valid
const status = await rain.checkTokenExpiration(accessToken);
```

### Comments

```typescript
// Create a comment
await rain.createComment({ comment: 'Great market!', poolId: '...' }, accessToken);

// Reply to a comment
await rain.createComment({ comment: 'I agree', poolId: '...', parentCommentId: '...' }, accessToken);

// Get comments for a pool
const comments = await rain.getCommentsListing({ poolId: '...', limit: 10, offset: 0 });

// Update a comment
await rain.updateComment({ commentId: '...', comment: 'Updated text' }, accessToken);

// Like / Unlike a comment
await rain.likeComment({ commentId: '...' }, accessToken);
await rain.unlikeComment({ commentId: '...' }, accessToken);

// Get comment count for a pool
const count = await rain.getCommentsCount({ poolId: '...' });
```

### Pools

```typescript
// Get public pools (paginated, filterable)
const pools = await rain.getPublicPools({ limit: 10, offset: 0, status: 'Live', sortBy: 'trending' });

// Get private pools
const pools = await rain.getPrivatePools({ limit: 10, offset: 0 }, accessToken);

// Get pool by ID
const pool = await rain.getPoolById({ id: '...' });

// Get pool by contract address
const pool = await rain.getPoolByContractAddress({ contractAddress: '0x...' });

// Search pools
const results = await rain.searchPool({ query: 'bitcoin', limit: 10, offset: 0 });

// Get featured pools
const featured = await rain.getFeaturedPools({ limit: 10, offset: 0 });

// Get all pools count
const count = await rain.getAllPoolsCount();

// Get related pools
const related = await rain.getRelatedPools({ poolId: '...' });

// Get pool resolution history (per sub-pool)
const history = await rain.getPoolResolutionHistory({ poolId: '...', subPool: '...' });

// Access a private pool
const access = await rain.accessPool({ poolId: '...', accessCode: '1234' });

// Verify access code
await rain.verifyAccessCode({ poolId: '...', accessCode: '1234' }, accessToken);

// Get pools created by a user
const pools = await rain.getPoolListingByCreator({ limit: 10, offset: 0 }, accessToken);

// Get total participants in a pool
const count = await rain.getPoolTotalParticipants({ poolId: '...' });

// Get total pools created by user
const count = await rain.getTotalPoolsCreatedByUser(accessToken);

// Get total predictions by user
const count = await rain.getTotalPredictionsByUser(accessToken);

// Update streaming status
await rain.updateStreaming({ poolId: '...', streaming: true }, accessToken);

// Update pool resolution time
await rain.updatePoolResolutionTime({ poolId: '...', newEndDate: '...' }, accessToken);

// Find pool fallback
const pool = await rain.findPoolFallback({ poolId: '...' });

// Sign oracles extend time
await rain.signOraclesExtendTime({ poolId: '...' }, accessToken);
```

### Investments

```typescript
// Get user's total investment in a pool
const investment = await rain.getUserTotalInvestment({ poolId: '...' }, accessToken);

// Get options total volume for a pool
const volume = await rain.getOptionsTotalVolume({ poolId: '...' });

// Get pool activity (trades)
const activity = await rain.getPoolActivity({ poolId: '...', limit: 10, offset: 0 });

// Get top holders in a pool
const holders = await rain.getTopHolders({ poolId: '...', limit: 10, offset: 0 });

// Get user's invested pools
const pools = await rain.getUserInvestedPools({ limit: 10, offset: 0 }, accessToken);

// Get platform TVL
const tvl = await rain.getPlatformTvl();

// Get investment volume graph
const graph = await rain.getInvestmentVolumeGraph({ period: '7d' }, accessToken);

// Calculate user PNL
const pnl = await rain.calculateUserPnl({ walletAddress: '0x...' }, accessToken);

// Get user total volume
const volume = await rain.calculateUserTotalVolume(accessToken);

// Get PNL graph
const graph = await rain.getUserPnlGraph({ period: '30d' }, accessToken);

// Get TVL graph
const graph = await rain.getTvlGraph();

// Get PNL per pool
const pnl = await rain.calculateUserPnlPerPool(accessToken);

// Get PNL by specific pool
const pnl = await rain.getPnlByPoolId({ poolId: '...' }, accessToken);

// Get top winners and losers
const leaderboard = await rain.getTopWinnersLosers({ limit: 10, period: '7d' });

// Get user overall investment
const overall = await rain.getUserOverallInvestment(accessToken);

// Get platform volume
const volume = await rain.getPlatformVolume();

// Get user invested live pools count
const count = await rain.getUserInvestedLivePoolsCount(accessToken);

// Calculate user open interest
const oi = await rain.calculateUserOpenInterest(accessToken);

// Get the authenticated user's positions in a specific subPool
// (per-side net shares, weighted average buy price, projected payout on win)
const positions = await rain.getUserPositions(
  { poolId: '...', subPoolIndex: 1 },
  accessToken
);

// Get the authenticated user's open positions across all subPools of a pool
// (one entry per (subPool, side) the user still holds; excludes claimed / losing sides)
const open = await rain.getOpenPositions({ poolId: '...' }, accessToken);
```

### Orders

```typescript
// Get user's orders
const orders = await rain.getUserOrders({ limit: 10, offset: 1, filter: 'pending' }, accessToken);

// Get order book for a pool
const book = await rain.getOrderBook({ pool: '...' });

// Get user's orders for a specific pool
const orders = await rain.getUserOrderByPoolId({ poolId: '...' }, accessToken);

// Get all orders for a pool
const orders = await rain.getOrdersListingByPool({ pool: '...', limit: 10, offset: 1 });

// Get order by ID
const order = await rain.getOrderById({ orderId: '...' });
```

### Points

```typescript
// Get user points
const points = await rain.getUserPoints(accessToken);

// Get user points graph
const graph = await rain.getUserPointsGraph(accessToken);

// Add user points
await rain.addUserPoints({ points: 100, reason: '...' }, accessToken);

// User successful onboarding
await rain.userSuccessfulOnboarding({ step: '...' }, accessToken);
```

### Notifications

```typescript
// Get notifications
const notifs = await rain.getNotifications({ limit: 20, offset: 0 }, accessToken);

// Mark all as read
await rain.markAllNotificationsAsRead(accessToken);

// Mark single notification as read
await rain.markNotificationAsRead({ notificationId: '...' }, accessToken);
```

### Price Data

```typescript
// Get price data for a pool
const prices = await rain.getPriceData({
  contractAddress: '0x...', // market contract address
  side: 1, // 1 = YES, 2 = NO
  filter: '1D', // '1H' | '6H' | '1D' | '1W' | '1M' | 'ALL'
});
```

### Pool Reviews

```typescript
// Add review
await rain.addReview({ poolId: '...', rating: 5, review: 'Great!' }, accessToken);

// Get user's reviews
const reviews = await rain.getUserReviews(accessToken);

// Get pools by creator with reviews
const pools = await rain.getPoolsByCreatorReviews(accessToken);
```

### Follow

```typescript
// Toggle follow a user
await rain.toggleFollow({ userId: '...' }, accessToken);

// Check if following
const status = await rain.checkFollow({ userId: '...' }, accessToken);

// Get followers
const followers = await rain.getFollowers({ userId: '...', limit: 20, offset: 0 });

// Get following
const following = await rain.getFollowing({ userId: '...', limit: 20, offset: 0 });

// Get follow stats
const stats = await rain.getFollowStats({ userId: '...' });
```

### Rain Burn

```typescript
// Get total RAIN burned
const burned = await rain.getTotalBurned();

// Get burn per pool
const burn = await rain.getBurnPerPool({ poolId: '...' });
```

### Dispute

```typescript
// Create dispute message (text)
await rain.createDisputeMessage({
  pool: '...',          // Parent pool document ID
  subPool: '...',       // SubPool document ID
  role: 'disputer',     // 'creator' | 'disputer' | 'proposer'
  messageType: 'text',  // 'text' | 'image' | 'video' | 'file' | 'youtube' | 'mixed'
  evidence: {
    options: ['Yes', 'No'],                // required, at least 2
    evidenceType: 'photo',                 // 'photo' | 'video' | 'pdf' | 'youtube' | 'mixed'
    question: 'Did the event happen?',     // optional
    description: 'Screenshot of result',   // optional
    source: 'https://espn.com/result',     // optional
    youtubeUrls: ['https://youtube.com/watch?v=abc123'], // optional
    urls: ['https://example.com/proof'],   // optional
  },
}, accessToken);

// Create dispute message with file attachments (image/video/pdf)
await rain.createDisputeMessage({
  pool: '...',
  subPool: '...',
  role: 'creator',
  messageType: 'image',     // set to 'file' for PDF
  files: [fileObject],      // File[] — required for image/video/file/mixed types, max 25MB each
  evidence: {
    options: ['Yes', 'No'],
    evidenceType: 'photo',  // use 'pdf' for PDF files
  },
}, accessToken);

// Get dispute conversation for a sub-pool
const convo = await rain.getPoolDisputeConvo({ poolId: '...', subPool: '...', limit: 50, offset: 0 }, accessToken);
```

### Whitelisted Tokens

```typescript
// Get token price in USD
const priceData = await rain.getTokenPrice('0x...'); // token contract address
// priceData.data = { price: 0.05 } — USD price per token
```

---

## WebSocket Events (Socket.IO)

Real-time event subscriptions via Socket.IO.

### Setup

```typescript
import { RainSocket } from 'rain-sdk-v2';

const socket = new RainSocket('https://dev-api.rain.one');
socket.connect();
```

### Pool-Scoped Events

Subscribe to events for a specific pool using `poolId`:

```typescript
// Trading events
const unsub = socket.onEnterOption(poolId, (data) => {
  console.log(data.enterOption, data.pool, data.subPool);
});

socket.onExitOption(poolId, (data) => { /* data.exitOption, pool, subPool */ });
socket.onLiquidity(poolId, (data) => { /* data.enterLiquidity, pool, subPool */ });
socket.onSplit(poolId, (data) => { /* data.split, pool, subPool */ });
socket.onMerge(poolId, (data) => { /* data.merge, pool, subPool */ });
socket.onRemoveLiquidity(poolId, (data) => { /* data.removeLiquidity, pool, subPool */ });

// Price updates
socket.onSyncPrice(poolId, (data) => {
  // data.prices = [{ side: 1, price: 0.62, percentage: 62, subPoolIndex: 1 }, ...]
  // data.pool, data.subPool
});

// Order book events
socket.onOrderCreated(poolId, (data) => { /* data.order, pool, subPool */ });
socket.onOrderCancelled(poolId, (data) => { /* data.order, pool, subPool */ });
socket.onOrderFilled(poolId, (data) => { /* data.filledOrder, data.pendingOrder?, pool, subPool */ });

// Pool lifecycle
socket.onPoolClosed(poolId, (data) => { /* data.pool, data.subPool? */ });
socket.onPoolReverted(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onPoolTokenSet(poolId, (data) => { /* data.pool */ });
socket.onStreamingStatusChanged(poolId, (data) => { /* data.pool */ });

// Resolution events
socket.onWinner(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onWinnerProposer(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onRevealWinnerAvailable(poolId, (data) => { /* data.subPoolId */ });

// Dispute & Appeal events
socket.onDisputeOpened(poolId, (data) => { /* data.subPool, data.eventType */ });
socket.onOracleCreated(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onDisputeTimeExtended(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onAppealOpened(poolId, (data) => { /* data.pool, data.subPool */ });
socket.onAppealWinnerCalculated(poolId, (data) => { /* data.subPool */ });
socket.onDisputeWinner(poolId, (data) => { /* data.subPool, data.eventType */ });
socket.onAppealWinner(poolId, (data) => { /* data.subPool, data.eventType, data.winnerFinalized */ });

// Claim events (pool-scoped broadcast)
socket.onClaimReward(poolId, (data) => { /* data.claimReward, pool, subPool */ });
```

### User-Scoped Events

Events targeted to a specific user (require `userId`):

```typescript
// Personal claim reward
socket.onUserClaimReward(poolId, userId, (data) => { /* data.claimReward, pool, subPool */ });

// Dispute bond refunded (disputer won)
socket.onDisputeRefund(poolId, userId, (data) => { /* data.claimReward, pool, subPool */ });

// Appeal fee refunded (appealer won)
socket.onAppealRefund(poolId, userId, (data) => { /* data.claimReward, pool, subPool */ });

// Resolution bond refunded (proposer was correct)
socket.onResolutionRefund(poolId, userId, (data) => { /* data.claimReward, pool, subPool */ });

// Resolver closing share reward
socket.onResolverReward(poolId, userId, (data) => { /* data.claimReward, pool, subPool */ });

// Personal notifications
socket.onNotifications(userId, (data) => {
  // data._id, userId, type, message, pool, subPool, createdAt, read
});
```

### Global Events

```typescript
// New pool created
socket.onNewPool((data) => { /* data.pool, data.subMarkets */ });
```

### Generic Subscription

```typescript
// Subscribe to any channel directly
const unsub = socket.onChannel('custom-event/123', (data) => { ... });

// Unsubscribe
unsub();
```

### Cleanup

```typescript
socket.disconnect();
```

### All Socket Event Channels

| Channel | Description |
|---------|-------------|
| `pool` | New pool created |
| `pool-token-set/{poolId}` | Token set for pool |
| `pool-closed/{poolId}` | Pool/SubPool finalized |
| `pool-reverted/{poolId}` | Resolution reverted |
| `streamingStatusChanged/{poolId}` | Streaming toggled |
| `enter-option/{poolId}` | Shares bought (AMM or order match) |
| `exit-option/{poolId}` | Shares sold (order match) |
| `liquidity/{poolId}` | Liquidity added |
| `split/{poolId}` | Tokens split into Yes+No |
| `merge/{poolId}` | Yes+No merged back |
| `remove-liquidity/{poolId}` | Liquidity removed |
| `sync-price/{poolId}` | Price update |
| `order-created/{poolId}` | New order placed |
| `order-cancelled/{poolId}` | Order cancelled |
| `order-filled/{poolId}` | Order filled (full/partial) |
| `winner/{poolId}` | Winner proposed |
| `winner-proposer/{poolId}` | Proposer recorded |
| `reveal-winner-available/{poolId}` | Appeal winner ready |
| `dispute-opened/{poolId}` | Dispute opened |
| `oracle-created/{poolId}` | Dispute oracle deployed |
| `dispute-time-extented/{poolId}` | Deadline extended |
| `appeal-opened/{poolId}` | Appeal filed |
| `appeal-winner-calculated/{poolId}` | Oracle calculated winner |
| `dispute-winner/{poolId}` | Dispute decided (LEX) |
| `appeal-winner/{poolId}` | Final appeal winner |
| `claim-reward/{poolId}` | Reward claimed (broadcast) |
| `claim-reward/{poolId}/{userId}` | Reward claimed (personal) |
| `dispute-refund/{poolId}/{userId}` | Dispute bond refunded |
| `appeal-refund/{poolId}/{userId}` | Appeal fee refunded |
| `resolution-refund/{poolId}/{userId}` | Resolution bond refunded |
| `resolver-reward/{poolId}/{userId}` | Resolver reward |
| `notifications/{userId}` | Personal notifications |

---

## License

MIT
