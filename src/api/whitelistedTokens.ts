import { ApiConfig, ApiResponse } from './types.js';
import { buildHeaders, handleResponse } from './helpers.js';

export async function getTokenPrice(
  tokenAddress: string,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/whitelisted-tokens/get-token-price?tokenAddress=${encodeURIComponent(tokenAddress)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
