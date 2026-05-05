import { ApiConfig, ApiResponse, AddUserPointsParams, UserOnboardingParams, PointsGraphParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function addUserPoints(
  params: AddUserPointsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/points/add-user-points`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getUserPoints(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/points/get-user-points`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function userSuccessfulOnboarding(
  params: UserOnboardingParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/points/user-succesfull-onboarding`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getUserPointsGraph(
  params: PointsGraphParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ range: params.range });
  const res = await fetch(`${config.apiUrl}/points/get-user-points-graph${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
