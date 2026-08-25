import {
  ApiConfig, ApiResponse, LeaderboardParams, LeaderboardData, LeaderboardCategory,
  LeaderboardSearchParams, LeaderboardSearchData,
  TraderRecentTradesParams, TraderRecentTradesData,
} from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function getLeaderboard(
  params: LeaderboardParams,
  config: ApiConfig
): Promise<ApiResponse<LeaderboardData>> {
  const qs = buildQuery({ board: params.board, window: params.window, category: params.category, limit: params.limit });
  const res = await fetch(`${config.apiUrl}/leaderboard${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function searchLeaderboard(
  params: LeaderboardSearchParams,
  config: ApiConfig
): Promise<ApiResponse<LeaderboardSearchData>> {
  const qs = buildQuery({ q: params.q, board: params.board, window: params.window, category: params.category, limit: params.limit });
  const res = await fetch(`${config.apiUrl}/leaderboard/search${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getTraderRecentTrades(
  params: TraderRecentTradesParams,
  config: ApiConfig
): Promise<ApiResponse<TraderRecentTradesData>> {
  const qs = buildQuery({ limit: params.limit });
  const res = await fetch(`${config.apiUrl}/leaderboard/traders/${encodeURIComponent(params.userId)}/recent-trades${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getLeaderboardCategories(
  config: ApiConfig
): Promise<ApiResponse<LeaderboardCategory[]>> {
  const res = await fetch(`${config.apiUrl}/leaderboard/categories`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
