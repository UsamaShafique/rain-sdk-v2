import { LoginParams, LoginResult } from './types.js';

/** Decode the `exp` (unix seconds) claim from a JWT without verifying it. Cross-environment (browser + Node). */
function decodeJwtExp(token: string): number | undefined {
  try {
    const part = token.split('.')[1];
    if (!part) return undefined;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = typeof atob === 'function'
      ? atob(padded)
      : Buffer.from(padded, 'base64').toString('binary');
    const payload = JSON.parse(json);
    return typeof payload?.exp === 'number' ? payload.exp : undefined;
  } catch {
    return undefined;
  }
}

export async function loginUser(
  params: LoginParams & { apiUrl: string }
): Promise<LoginResult> {
  const { signature, walletAddress, smartWalletAddress, referredBy, apiUrl } = params;
  // Plain-EOA integrations may omit smartWalletAddress; fall back to the EOA.
  const resolvedSmartWalletAddress = smartWalletAddress ?? walletAddress;

  const res = await fetch(`${apiUrl}/auth/login-or-register-with-walletAddress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiUrl.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {}),
    },
    body: JSON.stringify({
      sign: signature,
      walletAddress,
      userSmartAddress: resolvedSmartWalletAddress,
      ...(referredBy ? { referredBy } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  const accessToken = data?.token;
  const userId = data?.user?._id;

  if (!accessToken || !userId) {
    throw new Error('Login response missing token or user id');
  }

  return { accessToken, userId, expiresAt: decodeJwtExp(accessToken) };
}
