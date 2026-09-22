# Changelog

All notable changes to `rain-sdk-v2` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## Deprecation policy

APIs slated for removal are marked `@deprecated` in the type declarations for at
least one minor release before they are removed, with the replacement named in
the deprecation notice. Breaking removals land only in a major version.

## Security

Versions `< 2.5.0` are **deprecated on npm** — they build sell transactions with no
slippage protection by default (fixed in 2.5.0). See the Security notice in the
README and the 2.5.0 entry below. Upgrade to `>= 2.5.0`.

## [2.5.2] - Remove ngrok dev header

### Removed
- Dropped the `ngrok-skip-browser-warning` header handling from all request paths
  (`buildHeaders`, dispute upload, login, IPFS metadata upload). It was a dev-tunnel
  convenience gated behind `apiUrl.includes('ngrok')` and never fired against real
  environments. No behavior change for non-ngrok usage.

## [2.5.1] - Add LICENSE

### Added
- MIT `LICENSE` file at the repo root so GitHub detects the license (npm already
  declared MIT). No code changes.

## [2.5.0] - Sell slippage + create-market validation

### Fixed
- **Unprotected sells (critical):** `buildSellOptionTx` hard-coded `minAmountOut = 0`
  and silently ignored slippage — every SDK sell shipped with zero MEV/slippage
  protection despite the docs. It now quotes `getSellProceeds` on-chain and applies
  `slippageTolerance` (default 5%) when `minAmountOut` is omitted. Verified against
  live Arbitrum: the quote is the correct (slightly conservative) `minAmountOut`
  basis. Pass `minAmountOut: 0n` to opt out explicitly.
- **Silent market-odds corruption:** `createMarket` now validates bar values and
  option arrays and **throws** instead of silently redistributing the rounding
  remainder onto the last option (which turned `[60,60]` into a 60/40 market).
  Enforced: `no_of_options ≥ 2`; `marketOptions` / `barValues` / `initialYesPrices`
  lengths equal `no_of_options`; each bar value in `0–100`; bar values sum to 100;
  each `initialYesPrice` in `(0, 1e18)`.
- **`split` / `merge` option guard:** both now reject `option: 0n` (options are
  1-based) before any network call — the last two builders missing the guard.

### Changed (breaking)
- **`buildSellOptionTx` is now async** (`Promise<RawTransaction>`) because it makes
  an on-chain quote — this matches what the README already documented. Callers must
  `await` it. `SellOptionTxParams` gains `slippageTolerance?`.

### Added
- Test coverage grew to cover sell slippage derivation (mocked quote), create-market
  validation, and the split/merge option guards.

### Note for integrators
- Confirm the fee treatment of `getSellProceeds` vs. `sellOption` with the contract
  team; the SDK uses it as the contract's own sell quote and applies the slippage
  discount to it (empirically a conservative, safe floor).

## [2.4.0] - Production readiness

No breaking changes to the public API.

### Fixed
- **Docs correctness:** the `deadline` examples and parameter tables in the README
  no longer show `deadline: 600n` (a duration), which the builders reject since
  2.2.0. They now show an absolute unix timestamp and note the default 10-min window.

### Changed
- **viem-only (dropped `ethers`):** `utils/helpers.ts` (allowance + decimals reads,
  `parseUnits`, RPC liveness) is ported to viem. `ethers` is removed from
  dependencies — one web3 stack, smaller install/bundle. The redundant
  per-call `getNetwork()` RPC round-trip before allowance checks is gone.
- **`RainAA` browser-only, documented + guarded:** session methods now throw a
  clear error when `indexedDB` is unavailable (Node/SSR) instead of a cryptic
  `ReferenceError`. Documented in the README and class JSDoc. Use `Rain` for
  server-side flows.

### Added
- **Test suite (vitest):** unit tests for the validators and encoders, plus a
  gated Arbitrum integration test (`npm run test:integration`) exercising the
  on-chain read path. Scripts: `test`, `test:watch`, `test:integration`.
- **CI:** GitHub Actions — build + test on push/PR, and publish-on-release
  (`.github/workflows/`).

### Removed
- Dead `getRandomRpc` export (superseded by `getDefaultRpc` in 2.3.0).
- Committed `*.tgz` tarball removed from the repo and gitignored.

## [2.3.0] - Developer experience

Additive, non-breaking. Fills in the untyped core data model and adds the
convenience helpers the docs previously pushed onto the caller.

### Added
- **Typed pool DTOs (F-05):** exported `Pool`, `SubPool`, `PaginatedPools`, and
  `TradingModelName`. `getPublicPools` / `getPrivatePools` now return
  `ApiResponse<PaginatedPools>` instead of `unknown`. Socket `*EventData`
  payloads now type their `pool` / `subPool` / `subMarkets` fields as
  `Pool` / `SubPool`. Interfaces carry an index signature, so they are a safe
  superset of the wire (dynamic field access still works).
- **`rain.execute(txs, executor)` (F-07):** sequences the `[approval, main]`
  arrays the builders return — sends each tx and awaits its receipt before the
  next. Pluggable `TxExecutor` (`{ send, wait? }`) adapts to viem, ethers, or
  RainAA. Also exported as the standalone `executeTxs`.
- **`rain.parseAmount` / `rain.formatAmount` (F-14):** convert between
  human-readable amounts and base units using the token's configured decimals
  (no more hand-tracking that USDT is 6 and RAIN is 18).
- **`RAIN_SOCKET_EVENTS` (F-16):** correctly-spelled camelCase aliases for the
  raw wire event names (including the upstream-misspelled `dispute-time-extented`).
- **Token expiry (F-13):** `LoginResult.expiresAt` exposes the decoded JWT `exp`
  (unix seconds) so apps can renew proactively.

## [2.2.0] - Guardrails

Adds fail-fast validation and structured errors. These surface mistakes
synchronously (before broadcast) instead of as on-chain reverts or parsed
strings. Existing `catch (e)` blocks keep working — the new errors extend `Error`.

### Added
- **Build-time parameter validation (F-03):** every transaction builder now
  rejects the documented footguns before encoding — a `deadline` that looks like
  a duration (`< 1_000_000_000`) or is already expired, a `slippageTolerance`
  outside `0–100` (whole percent, not bps), and a 0-based `option`/`selectedOption`
  (options are 1-based). Throws the new `RainValidationError`. Exported helpers:
  `assertDeadline`, `assertSlippage`, `assertOption`.
- **Structured API errors (F-06):** non-2xx REST responses now throw
  `RainApiError` carrying `status`, `endpoint`, `body`, and a stable `code`
  (`NOT_FOUND` | `UNAUTHORIZED` | `FORBIDDEN` | `RATE_LIMITED` | `SERVER_ERROR` |
  `UNKNOWN`) — branch on `err.code` instead of parsing message strings.

### Changed
- **Empty states are no longer errors (F-06):** `getPnlByPoolId` (no position)
  and `getTokenPrice` (non-whitelisted token) now return
  `{ statusCode: 200, data: null }` on a 404 instead of throwing.
- **Deterministic default RPC (F-09):** omitting `rpcUrl` now resolves to a
  single fixed public RPC (previously random per instance). In `production`
  without an `rpcUrl`, the SDK emits a `console.warn` recommending a dedicated
  endpoint.

## [2.1.9] - Correctness patch

Addresses findings from the September 2026 independent technical review. No
behaviour change for correct callers.

### Fixed
- **Missing type exports (F-10):** `SellOptionTxParams`, `EntrySharesResult`,
  `SellProceedsResult`, and `OrderLevelInfo` are now exported from the package
  root, so consumers can annotate their own functions with them.
- **`RainConfig` type honesty (F-04):** `alchemyApiKey` and `paymasterPolicyId`
  are now required in the type — the `RainAA` constructor already threw without
  them. The type now matches runtime behaviour.
- **`smartWalletAddress` optional (F-08):** `LoginParams.smartWalletAddress` is
  now optional and defaults to `walletAddress`, so plain-EOA integrations no
  longer have to pass the address twice.

### Notes
- Two review findings (F-01 reverting order reads, F-02 REST type/wire
  mismatches) require verification against the live dev API/contracts before any
  change and are intentionally not addressed in this release.
