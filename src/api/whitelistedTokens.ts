import { ApiConfig, ApiResponse } from './types.js';
import { buildHeaders, handleResponse } from './helpers.js';

export async function getTokenPrice(
  tokenAddress: string,
  config: ApiConfig
): Promise<ApiResponse> {
  const endpoint = '/whitelisted-tokens/get-token-price';
  const res = await fetch(`${config.apiUrl}${endpoint}?tokenAddress=${encodeURIComponent(tokenAddress)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  // A non-whitelisted token is a legitimate empty state, not an error.
  if (res.status === 404) {
    return { statusCode: 200, message: 'Token not whitelisted or no price available', data: null };
  }
  return handleResponse(res, endpoint);
}
