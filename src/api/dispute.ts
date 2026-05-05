import { ApiConfig, ApiResponse, CreateDisputeMessageParams, GetPoolDisputeConvoParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function createDisputeMessage(
  params: CreateDisputeMessageParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('pool', params.pool);
  formData.append('role', params.role);
  formData.append('messageType', params.messageType);
  formData.append('evidence', JSON.stringify(params.evidence));
  if (params.file) {
    formData.append('file', params.file);
  }

  const headers: Record<string, string> = {};
  if (config.accessToken) {
    headers['Authorization'] = `Bearer ${config.accessToken}`;
  }
  // Do not set Content-Type for FormData; the browser sets the boundary automatically.

  const res = await fetch(`${config.apiUrl}/dispute/create-dispute-message`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse(res);
}

export async function getPoolDisputeConvo(
  params: GetPoolDisputeConvoParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/dispute/get-pool-dispute-convo/${encodeURIComponent(params.poolId)}${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
