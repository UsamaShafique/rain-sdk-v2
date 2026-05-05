import { ApiConfig, ApiResponse, CreateCommentParams, CommentsListingParams, UpdateCommentParams, CommentCountParams } from './types.js';
import { buildHeaders, buildQuery, handleResponse } from './helpers.js';

export async function createComment(
  params: CreateCommentParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/comments/create-comment`, {
    method: 'POST',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}

export async function getCommentsListing(
  params: CommentsListingParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const qs = buildQuery({ poolId: params.poolId, limit: params.limit, offset: params.offset });
  const res = await fetch(`${config.apiUrl}/comments/comments-listing${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function updateComment(
  params: UpdateCommentParams,
  config: ApiConfig
): Promise<ApiResponse> {
  const { commentId, comment } = params;
  const res = await fetch(`${config.apiUrl}/comments/update-comment/${encodeURIComponent(commentId)}`, {
    method: 'PUT',
    headers: buildHeaders(config, 'application/json'),
    body: JSON.stringify({ comment }),
  });
  return handleResponse(res);
}

export async function likeComment(
  params: { commentId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/comments/like/${encodeURIComponent(params.commentId)}`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function unlikeComment(
  params: { commentId: string },
  config: ApiConfig
): Promise<ApiResponse> {
  const res = await fetch(`${config.apiUrl}/comments/unlike/${encodeURIComponent(params.commentId)}`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}

export async function getCommentsCount(
  params: CommentCountParams,
  config: ApiConfig
): Promise<ApiResponse<{ poolId: string; count: number }>> {
  const qs = buildQuery({ poolId: params.poolId });
  const res = await fetch(`${config.apiUrl}/comments/comments-count${qs}`, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  return handleResponse(res);
}
