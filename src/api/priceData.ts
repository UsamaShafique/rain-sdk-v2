import { ApiConfig, ApiResponse, PriceDataParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function getPriceData(
  params: PriceDataParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ contractAddress: params.contractAddress, side: params.side, filter: params.filter });
  const res = await fetch(`${config.apiUrl}/price-data/get-price-data${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
