import { ApiConfig } from './types.js';

export function buildHeaders(config: ApiConfig, contentType?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (config.apiUrl?.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (config.accessToken) {
    headers['Authorization'] = `Bearer ${config.accessToken}`;
  }
  return headers;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null
  );
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}

export type RainApiErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

/**
 * Structured error thrown by every REST wrapper on a non-2xx response.
 * Extends `Error` (so existing `catch` blocks keep working) but adds
 * `status`, `endpoint`, `body`, and a stable `code` to branch on instead of
 * parsing message strings.
 */
export class RainApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    public readonly endpoint?: string,
    public readonly code: RainApiErrorCode = 'UNKNOWN',
  ) {
    super(`Rain API error ${status}${endpoint ? ` on ${endpoint}` : ''}`);
    this.name = 'RainApiError';
  }
}

function codeForStatus(status: number): RainApiErrorCode {
  switch (status) {
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 429: return 'RATE_LIMITED';
    default: return status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN';
  }
}

export async function handleResponse<T>(res: Response, endpoint?: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let body: unknown = text;
    try { body = JSON.parse(text); } catch { /* not JSON — keep raw text */ }
    throw new RainApiError(res.status, body, endpoint, codeForStatus(res.status));
  }
  return res.json() as Promise<T>;
}
