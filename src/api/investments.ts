import {
  ApiConfig, ApiResponse, UserTotalInvestmentParams, OptionsTotalVolumeParams,
  PoolActivityParams, TopHoldersParams, UserInvestedPoolsParams,
  InvestmentVolumeGraphParams, UserPnlGraphParams, TopWinnersLosersParams, PnlByPoolIdParams,
} from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function getUserTotalInvestment(
  params: UserTotalInvestmentParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ poolId: params.poolId });
  const res = await fetch(`${config.apiUrl}/investments/user-total-investment${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getOptionsTotalVolume(
  params: OptionsTotalVolumeParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ poolId: params.poolId });
  const res = await fetch(`${config.apiUrl}/investments/options-total-volume${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolActivity(
  params: PoolActivityParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/investments/${encodeURIComponent(params.poolId)}/pool-activity${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTopHolders(
  params: TopHoldersParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ subPoolIndex: params.subPoolIndex, limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/investments/${encodeURIComponent(params.poolId)}/top-holders${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserInvestedPools(
  params: UserInvestedPoolsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/investments/user-invested-pools${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPlatformTVL(config: ApiConfig): Promise<ApiResponse<{ tvl: number }>> {
  const res = await fetch(`${config.apiUrl}/investments/platform-tvl`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getInvestmentVolumeGraph(
  params: InvestmentVolumeGraphParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ timeframe: params.timeframe });
  const res = await fetch(`${config.apiUrl}/investments/investment-volume-graph${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function calculateUserPNL(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/calculate-user-PNL`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function calculateUserTotalVolume(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/calculate-user-total-volume`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserPnlGraph(
  params: UserPnlGraphParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ timeframe: params.timeframe });
  const res = await fetch(`${config.apiUrl}/investments/get-user-pnl-graph${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTVLGraph(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/TVL-graph`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function calculateUserPNLPerPool(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/calculate-user-PNL-per-pool`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPnlByPoolId(
  params: PnlByPoolIdParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/pnl/${encodeURIComponent(params.poolId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTopWinnersLosers(
  params: TopWinnersLosersParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ timeFilter: params.timeFilter });
  const res = await fetch(`${config.apiUrl}/investments/top-winners-losers${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserOverallInvestment(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/user-over-all-investment`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPlatformVolume(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/platform-volume`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserInvestedLivePoolsCount(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/user-invested-live-pools-count`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function calculateUserOpenInterest(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/investments/calculate-user-open-interest`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
