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

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}
