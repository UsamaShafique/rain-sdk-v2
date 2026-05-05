import { ApiConfig, ApiResponse, FollowToggleParams, FollowCheckParams, FollowListParams, FollowStatsParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function toggleFollow(
  params: FollowToggleParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/follow/toggle/${encodeURIComponent(params.userId)}`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function checkFollow(
  params: FollowCheckParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/follow/check/${encodeURIComponent(params.userId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getFollowers(
  params: FollowListParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ page: params.page, limit: params.limit });
  const res = await fetch(`${config.apiUrl}/follow/followers/${encodeURIComponent(params.userId)}${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getFollowing(
  params: FollowListParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ page: params.page, limit: params.limit });
  const res = await fetch(`${config.apiUrl}/follow/following/${encodeURIComponent(params.userId)}${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getFollowStats(
  params: FollowStatsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/follow/stats/${encodeURIComponent(params.userId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
