import {
  ApiConfig, ApiResponse, CreateOrderParams, GetUserOrdersParams,
  OrderBookParams, GetUserOrderByPoolIdParams, OrdersListingByPoolParams,
} from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function createOrder(
  params: CreateOrderParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/orders/create-order`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getUserOrders(
  params: GetUserOrdersParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ filter: params.filter, limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/orders/get-user-orders${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getOrderBook(
  params: OrderBookParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ pool: params.pool, limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/orders/order-book${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getUserOrderByPoolId(
  params: GetUserOrderByPoolIdParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ filter: params.filter });
  const res = await fetch(`${config.apiUrl}/orders/get-user-order-by-poolId/${encodeURIComponent(params.poolId)}${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getOrdersListingByPool(
  params: OrdersListingByPoolParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ pool: params.pool, limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/orders/orders-listing-by-pool${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getOrderById(
  params: { orderId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/orders/get-order/${encodeURIComponent(params.orderId)}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
