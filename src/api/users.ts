import { ApiConfig, ApiResponse, UserProfile, UserProfileUpdateParams, UserHistoryParams, UserHistoryResponse } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function findUserByWalletAddress(
  params: { walletAddress: string },
  config: ApiConfig
): Promise<ApiResponse<UserProfile>> {
  const qs = buildQuery({ walletAddress: params.walletAddress });
  const res = await fetch(`${config.apiUrl}/users/find-user-by-wallet-address${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function updateUserProfile(
  params: UserProfileUpdateParams,
  config: ApiConfig
): Promise<ApiResponse<UserProfile>> {
  const res = await fetch(`${config.apiUrl}/users/user-profile-update`, {
    method: 'PATCH',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getUserProfile(config: ApiConfig): Promise<ApiResponse<UserProfile>> {
  const res = await fetch(`${config.apiUrl}/users/user-profile`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUsersTotalCount(config: ApiConfig): Promise<ApiResponse<{ totalUsers: number }>> {
  const res = await fetch(`${config.apiUrl}/users/users-total-count`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function removeUserProfilePic(config: ApiConfig): Promise<ApiResponse<UserProfile>> {
  const res = await fetch(`${config.apiUrl}/users/remove-user-profile-pic`, {
    method: 'PATCH',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserHistory(
  params: UserHistoryParams,
  config: ApiConfig
): Promise<ApiResponse<UserHistoryResponse>> {
  const qs = buildQuery({ limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/users/get-user-history${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function viewUserProfile(
  params: { userId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/users/view-user-profile/${encodeURIComponent(params.userId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function checkTokenExpiration(config: ApiConfig): Promise<ApiResponse> {
  const qs = buildQuery({ token: config.accessToken });
  const res = await fetch(`${config.apiUrl}/users/check-token-expiration${qs}`, {
    method: 'GET',
    headers: buildHeaders({ apiUrl: config.apiUrl }),
  });
  return handleResponse(res);
}
