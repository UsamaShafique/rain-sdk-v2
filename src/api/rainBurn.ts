import { ApiConfig, ApiResponse, RainBurnPerPoolParams } from './types.js';
import { buildHeaders, handleResponse } from './helpers.js';

export async function getTotalBurned(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/rain-token/total-burned`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getBurnPerPool(
  params: RainBurnPerPoolParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/rain-token/per-pool/${encodeURIComponent(params.poolId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
