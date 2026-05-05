# Rain SDK V2

TypeScript SDK for the Rain prediction markets protocol on Arbitrum One. Provides transaction builders for market creation, trading, liquidity management, order book operations, dispute resolution, and smart account (Account Abstraction) support.

## Installation

```bash
npm install @buidlrrr/rain-sdk-v2 viem
```

### Optional (for Smart Account / Account Abstraction)

```bash
npm install @alchemy/aa-core @account-kit/infra @account-kit/wallet-client
```

## Quick Start

```typescript
import { Rain, RainAA, TradingModel, OptionSide } from '@buidlrrr/rain-sdk-v2';
import { createWalletClient, custom, parseUnits, parseEther } from 'viem';
import { arbitrum } from 'viem/chains';

// Initialize SDK
const rain = new Rain({
  environment: 'development', // 'development' | 'stage' | 'production'
  rpcUrl: 'https://arb1.arbitrum.io/rpc', // optional, uses random public RPC if omitted
});

// Get environment config
const config = rain.getEnvironmentConfig();
console.log(config.usdt_token); // USDT contract address
console.log(config.market_factory_address); // Factory contract
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
const txs = await rain.buildCreateMarketTx({
  marketQuestion: 'Will ETH reach $5000 by end of 2025?',
  marketOptions: ['Yes', 'No', 'Maybe'],
  marketTags: ['crypto'],
  marketDescription: 'Prediction on ETH price target',
  isPublic: true,
  isPublicPoolResolverAi: true, // true = AI resolver, false = manual resolver
  creator: '0x...', // smart account or EOA address
  startTime: BigInt(Math.floor(Date.now() / 1000) + 120), // 2 min from now
  endTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24h from now
  no_of_options: 3n,
  disputeTimer: 60, // seconds (set by SDK from environment)
  inputAmountWei: parseUnits('10', 6), // 10 USDT initial liquidity
  barValues: [33.33, 33.33, 33.34], // probability distribution (0-100, sums to 100)
  baseToken: config.usdt_token, // USDT address
  tradingModel: TradingModel.AMM, // AMM = 0, OrderBook = 1
});

// Approval amount = liquidity + (oracleFixedFeePerOption * numberOfOptions)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketQuestion` | `string` | The market question |
| `marketOptions` | `string[]` | Option labels (3-26 options) |
| `marketTags` | `string[]` | Tags (1-3) |
| `marketDescription` | `string` | Description |
| `isPublic` | `boolean` | Public market |
| `isPublicPoolResolverAi` | `boolean` | `true` for AI resolver, `false` for manual |
| `creator` | `0x${string}` | Creator/pool owner address |
| `startTime` | `bigint` | Unix timestamp (seconds) |
| `endTime` | `bigint` | Unix timestamp (seconds) |
| `no_of_options` | `bigint` | Number of options |
| `inputAmountWei` | `bigint` | Initial liquidity in base token wei |
| `barValues` | `number[]` | Probability distribution (0-100 scale) |
| `baseToken` | `0x${string}` | Base token address (USDT) |
| `tradingModel` | `TradingModel` | `AMM (0)` or `OrderBook (1)` |

---

### Trading

#### `buildEnterOptionTx(params: EnterOptionTxParams): RawTransaction`

Buy shares of an option (AMM trade).

```typescript
const tx = rain.buildEnterOptionTx({
  marketContractAddress: '0x...',
  selectedOption: 1n, // 1-based option index
  optionSide: OptionSide.Yes, // Yes = 1, No = 2
  buyAmountInWei: parseUnits('5', 6), // 5 USDT
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `marketContractAddress` | `0x${string}` | Market contract address |
| `selectedOption` | `bigint` | Option index (1-based) |
| `optionSide` | `OptionSide` | `Yes (1)` or `No (2)` |
| `buyAmountInWei` | `bigint` | Amount in base token wei |

> **Note:** Requires prior ERC20 approval to the market contract.

---

### Split & Merge

#### `buildSplitTx(params: SplitTxParams): RawTransaction`

Split base tokens into equal Yes + No shares for an option.

```typescript
const tx = rain.buildSplitTx({
  marketContractAddress: '0x...',
  option: 1n,
  amount: parseUnits('5', 6), // 5 USDT -> 5 Yes shares + 5 No shares
});
```

> **Note:** Requires prior ERC20 approval to the market contract.

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

#### `buildAddLiquidityTx(params: AddLiquidityTxParams): RawTransaction`

Add liquidity to a specific option.

```typescript
const tx = rain.buildAddLiquidityTx({
  marketContractAddress: '0x...',
  option: 1n,
  totalAmountInWei: parseUnits('10', 6), // 10 USDT
});
```

> **Note:** Requires prior ERC20 approval to the market contract.

#### `buildRemoveLiquidityTx(params: RemoveLiquidityTxParams): RawTransaction`

Remove liquidity by burning LP shares.

```typescript
const lpShares = await rain.getUserOptionLPShares({
  marketContractAddress: '0x...',
  option: 1n,
  userAddress: '0x...',
});

const tx = rain.buildRemoveLiquidityTx({
  marketContractAddress: '0x...',
  option: 1n,
  lpShares, // raw LP shares amount
});
```

---

### Order Book

#### `buildPlaceBuyOrderTx(params: PlaceBuyOrderTxParams): RawTransaction`

Place a limit buy order.

```typescript
const tx = rain.buildPlaceBuyOrderTx({
  marketContractAddress: '0x...',
  option: 1n,
  optionSide: OptionSide.Yes,
  price: parseEther('0.5'), // 50% price in 1e18 scale
  amount: parseUnits('10', 6), // 10 USDT
});
```

> **Note:** Requires prior ERC20 approval to the market contract. Available when AMM pool is closed.

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
  tokenAddress: config.usdt_token,
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
  tokenAddress: config.usdt_token,
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

```typescript
const result = await rain.login({
  signature: '0x...', // personal_sign of lowercased wallet address
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
| `oracle_fixed_fee_per_option` | Oracle fee per option in base token wei |
| `usdt_symbol` | USDT token symbol |
| `usdt_token` | USDT token address |
| `rain_token` | RAIN token address |

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

| Environment | API | Factory |
|-------------|-----|---------|
| `development` | `https://dev-api.rain.one` | `0xBD99...0adE` |
| `stage` | `https://stg-api.rain.one` | `0xD490...96BE` |
| `production` | `https://prod-api.rain.one` | `0xA864...F264` |

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
8. Claim (buildClaimTx)
```

If disputed:
```
6b. Open Dispute (buildOpenDisputeTx)
6c. Appeal (buildOpenDisputeTx again)
```

---

## License

MIT
