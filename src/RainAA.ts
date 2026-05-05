import { custom, createWalletClient } from 'viem';

import { RainConfig } from './types.js';
import { RawTransaction } from './tx/types.js';

export class RainAA {
    private config: RainConfig;
    private _client: any | null = null;
    private _account: any | null = null;
    private _address: `0x${string}` | null = null;

    constructor(config: RainConfig) {
        if (!config.walletClient) throw new Error('walletClient is required');
        if (!config.alchemyApiKey) throw new Error('alchemyApiKey is required');
        if (!config.paymasterPolicyId) throw new Error('paymasterPolicyId is required');
        if (!config.chain) throw new Error('chain is required');
        this.config = config;
    }

    /**
     * Initializes the Smart Account
     */
    async connect(): Promise<`0x${string}`> {
        if (this._address && this._client) {
            return this._address;
        }

        try {
            const [{ WalletClientSigner }, infraMod, { createSmartWalletClient }] = await Promise.all([
                // @ts-ignore - optional peer dependency, lazy-loaded at runtime
                import('@alchemy/aa-core'),
                // @ts-ignore - optional peer dependency, lazy-loaded at runtime
                import('@account-kit/infra'),
                // @ts-ignore - optional peer dependency, lazy-loaded at runtime
                import('@account-kit/wallet-client'),
            ]);

            const { alchemy, defineAlchemyChain } = infraMod;

            // Wrap the viem chain with alchemy RPC URLs so @account-kit accepts it
            const alchemyChain = defineAlchemyChain({
                chain: this.config.chain,
                rpcBaseUrl: `https://${this.config.chain.id === 42161 ? 'arb-mainnet' : 'arb-sepolia'}.g.alchemy.com/v2`,
            });

            const signer = new WalletClientSigner(
                createWalletClient({
                    transport: custom(this.config.walletClient),
                }) as any,
                'wallet'
            );

            const client = createSmartWalletClient({
                chain: alchemyChain as any,
                signer: signer as any,
                policyId: this.config.paymasterPolicyId,
                transport: alchemy({
                    apiKey: this.config.alchemyApiKey,
                    nodeRpcUrl: this.config.rpcUrl,
                } as any),
            });

            const account = await client.requestAccount();

            if (!account?.address) {
                throw new Error('Failed to create smart account');
            }

            this._client = client;
            this._account = account;
            this._address = account.address;

            return account.address;
        } catch (err) {
            console.error('[Rain SDK V2] connect failed:', err);
            throw err;
        }
    }


    /**
     * Returns smart account address
     */
    get address() {
        if (!this._address) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }
        return this._address;
    }

    /**
     * Returns smart account client
     */
    get client() {
        if (!this._client) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }
        return this._client;
    }

    /**
     * Sends a raw transaction from the smart account.
     */
    async sendTransaction(rawTx: RawTransaction): Promise<`0x${string}`> {
        if (!this._client || !this._account) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }

        // @account-kit/wallet-client v4.x uses standalone sendCalls function
        // @ts-ignore - optional peer dependency
        const { sendCalls } = await import('@account-kit/wallet-client');

        const result = await sendCalls(this._client, {
            account: this._account,
            calls: [{
                to: rawTx.to,
                data: rawTx.data,
                value: rawTx.value ?? 0n,
            }],
        });

        return result as `0x${string}`;
    }

    /**
     * Reset connection (optional)
     */
    disconnect() {
        this._client = null;
        this._account = null;
        this._address = null;
    }
}
