# Changelog

All notable changes to `rain-sdk-v2` are documented here. This project follows
[Semantic Versioning](https://semver.org/).

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
