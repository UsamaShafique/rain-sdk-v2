import { ApiConfig, ApiResponse, AddReviewParams } from './types.js';
import { buildHeaders, handleResponse } from './helpers.js';

export async function addReview(
  params: AddReviewParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pool-reviews/add-review`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getUserReviews(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pool-reviews/user-reviews`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getPoolsByCreatorReviews(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/pool-reviews/pools-by-creator`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
