import { ApiConfig, ApiResponse, ToggleBookmarkParams, GetBookmarksParams, CheckBookmarkParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function toggleBookmark(
  params: ToggleBookmarkParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/bookmarks/toggle/${encodeURIComponent(params.poolId)}`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getBookmarks(
  params: GetBookmarksParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ page: params.page, limit: params.limit });
  const res = await fetch(`${config.apiUrl}/bookmarks${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function checkBookmark(
  params: CheckBookmarkParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/bookmarks/check/${encodeURIComponent(params.poolId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
