import { ApiConfig, ApiResponse, GetNotificationsParams, MarkNotificationAsReadParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function getNotifications(
  params: GetNotificationsParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ page: params.page, limit: params.limit, status: params.status });
  const res = await fetch(`${config.apiUrl}/notifications/get-notifications${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function markAllNotificationsAsRead(config: ApiConfig): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/notifications/mark-all-as-read`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function markNotificationAsRead(
  params: MarkNotificationAsReadParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/notifications/mark-notification-as-read`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify({ id: params.id }),
  });
  return handleResponse(res);
}
