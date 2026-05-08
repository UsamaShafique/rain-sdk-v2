import { WalletClient } from 'viem';

/**
 * Signs the lowercased wallet address using personal_sign.
 * This signature is required for the Rain login API.
 */
export async function signLoginMessage(
    walletClient: WalletClient,
    walletAddress: `0x${string}`
): Promise<string> {
    const message = walletAddress.toLowerCase();
    const signature = await walletClient.signMessage({
        account: walletAddress,
        message,
    });
    return signature;
}
