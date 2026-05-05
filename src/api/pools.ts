import {
  ApiConfig, ApiResponse, PublicPoolsParams, PrivatePoolsParams,
  PoolListingByCreatorParams, VerifyAccessCodeParams, PoolTotalParticipantsParams,
  SearchPoolParams, RelatedPoolsParams, UpdateStreamingParams,
  UpdatePoolResolutionTimeParams, FindPoolFallbackParams, SignOraclesExtendTimeParams,
} from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function accessPool(
  params: { poolId: string; accessCode: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(
    `${config.apiUrl}/pools/access-pool/${encodeURIComponent(params.poolId)}/${encodeURIComponent(params.accessCode)}`,
    { method: 'GET', headers: buildHeaders(config) }
  );
  return handleResponse(res);
}

export async function getPublicPools(
  params: PublicPoolsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset, tag: params.tag, sortBy: params.sortBy, status: params.status });
  const res = await fetch(`${config.apiUrl}/pools/public-pools${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPrivatePools(
  params: PrivatePoolsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset, tag: params.tag, status: params.status });
  const res = await fetch(`${config.apiUrl}/pools/pools-private${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolById(
  params: { id: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/pool/${encodeURIComponent(params.id)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolByContractAddress(
  params: { contractAddress: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/poolByContractAddress/${encodeURIComponent(params.contractAddress)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function searchPool(
  params: SearchPoolParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ question: params.question });
  const res = await fetch(`${config.apiUrl}/pools/search-pool${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function verifyAccessCode(
  params: VerifyAccessCodeParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/verify-access-code`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getPoolListingByCreator(
  params: PoolListingByCreatorParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset, filter: params.filter });
  const res = await fetch(`${config.apiUrl}/pools/pool-listing-by-creator${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function searchPoolById(
  params: { poolId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/search/${encodeURIComponent(params.poolId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolTotalParticipants(
  params: PoolTotalParticipantsParams,
  config: ApiConfig
): Promise<ApiResponse<{ totalParticipants: number }>> {
  const qs = buildQuery({ poolId: params.poolId });
  const res = await fetch(`${config.apiUrl}/pools/pool-total-participants${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTotalPoolsByUser(config: ApiConfig): Promise<ApiResponse<{ totalPoolsCreated: number }>> {
  const res = await fetch(`${config.apiUrl}/pools/total-pools-created-by-user`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function signOraclesExtendTime(
  params: SignOraclesExtendTimeParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ contractAddress: params.contractAddress, walletAddress: params.walletAddress });
  const res = await fetch(`${config.apiUrl}/pools/sign-oracles-extend-time${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTotalPredictionsByUser(config: ApiConfig): Promise<ApiResponse<{ totalPredictions: number }>> {
  const res = await fetch(`${config.apiUrl}/pools/total-predictions-by-user`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function updateStreaming(
  params: UpdateStreamingParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/update-streaming`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getAllPoolsCount(config: ApiConfig): Promise<ApiResponse<{ openPoolsCount: number }>> {
  const res = await fetch(`${config.apiUrl}/pools/get-all-pools-count`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getRelatedPools(
  params: RelatedPoolsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/pools/get-related-pools/${encodeURIComponent(params.poolId)}${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolResolutionHistory(
  params: { poolId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/get-pool-resolution-history/${encodeURIComponent(params.poolId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function updatePoolResolutionTime(
  params: UpdatePoolResolutionTimeParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/update-pool-resolution-time`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function findPoolFallback(
  params: FindPoolFallbackParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/find-pool-fallback`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getFeaturedPools(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pools/get-featured-pools`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
