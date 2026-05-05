import { custom, createWalletClient, toHex } from 'viem';

import { RainConfig } from './types.js';
import { RawTransaction } from './tx/types.js';

const SESSION_DURATION_SEC = 60 * 60 * 24; // 24 hours
const DB_NAME = 'RainSDKV2';
const STORE_NAME = 'sessions';

type SessionData = {
    privateKey: `0x${string}`;
    context: `0x${string}`;
    expirySec: number;
    smartAccountAddress: `0x${string}`;
};

function openSessionDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function loadSession(key: string): Promise<SessionData | null> {
    const db = await openSessionDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve((req.result ?? null) as SessionData | null);
        req.onerror = () => reject(req.error);
    });
}

async function saveSession(key: string, data: SessionData): Promise<void> {
    const db = await openSessionDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function deleteSession(key: string): Promise<void> {
    const db = await openSessionDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export class RainAA {
    private config: RainConfig;
    private _client: any | null = null;        // EOA-signed client (for grantPermissions)
    private _sessionClient: any | null = null; // session-key client (for sendCalls)
    private _account: any | null = null;
    private _address: `0x${string}` | null = null;
    private _sessionContext: `0x${string}` | null = null;
    private _sessionKeyAddress: `0x${string}` | null = null;
    private _sessionPrivateKey: `0x${string}` | null = null;
    private _sessionExpirySec: number | null = null;
    private _alchemyChain: any = null;
    private _aaSdk: any = null;
    private _walletClientLib: any = null;
    private _viemAccounts: any = null;
    private _alchemyTransportFactory: any = null;

    constructor(config: RainConfig) {
        if (!config.walletClient) throw new Error('walletClient is required');
        if (!config.alchemyApiKey) throw new Error('alchemyApiKey is required');
        if (!config.paymasterPolicyId) throw new Error('paymasterPolicyId is required');
        if (!config.chain) throw new Error('chain is required');
        this.config = config;
    }

    /**
     * Initializes the smart account. Does NOT trigger MetaMask. If a still-valid
     * session is persisted in IndexedDB for this account, it is rehydrated
     * silently and `hasActiveSession` will be true — sends work immediately.
     * Otherwise the caller must invoke `grantSession()` (which prompts MetaMask)
     * before sending transactions.
     */
    async connect(): Promise<`0x${string}`> {
        if (this._address && this._client) {
            return this._address;
        }

        try {
            const [
                { WalletClientSigner, LocalAccountSigner },
                infraMod,
                walletClientLib,
                viemAccounts,
            ] = await Promise.all([
                // @ts-ignore - peer dep
                import('@aa-sdk/core'),
                // @ts-ignore - peer dep
                import('@account-kit/infra'),
                // @ts-ignore - peer dep
                import('@account-kit/wallet-client'),
                // @ts-ignore - viem subpath
                import('viem/accounts'),
            ]);

            const { createSmartWalletClient } = walletClientLib;
            const { alchemy, defineAlchemyChain } = infraMod;
            const { privateKeyToAccount } = viemAccounts;

            const alchemyChain = defineAlchemyChain({
                chain: this.config.chain,
                rpcBaseUrl: `https://${this.config.chain.id === 42161 ? 'arb-mainnet' : 'arb-sepolia'}.g.alchemy.com/v2`,
            });

            const eoaSigner = new WalletClientSigner(
                createWalletClient({
                    transport: custom(this.config.walletClient),
                }) as any,
                'wallet'
            );

            const eoaClient = createSmartWalletClient({
                chain: alchemyChain as any,
                signer: eoaSigner as any,
                policyId: this.config.paymasterPolicyId,
                transport: alchemy({
                    apiKey: this.config.alchemyApiKey,
                    nodeRpcUrl: this.config.rpcUrl,
                } as any),
            });

            const account = await eoaClient.requestAccount();
            if (!account?.address) throw new Error('Failed to create smart account');

            this._client = eoaClient;
            this._account = account;
            this._address = account.address;

            // Cache modules for later use in grantSession()
            this._aaSdk = { LocalAccountSigner };
            this._walletClientLib = walletClientLib;
            this._viemAccounts = viemAccounts;
            this._alchemyChain = alchemyChain;
            this._alchemyTransportFactory = alchemy;

            // Try to rehydrate an existing valid session WITHOUT prompting MetaMask.
            const storageKey = `sessionKeyData:${account.address.toLowerCase()}`;
            const now = Math.floor(Date.now() / 1000);
            const stored = await loadSession(storageKey).catch(() => null);
            const sessionStillValid =
                stored &&
                stored.expirySec > now &&
                stored.smartAccountAddress?.toLowerCase() === account.address.toLowerCase();

            if (sessionStillValid && stored) {
                const sessionAccount = privateKeyToAccount(stored.privateKey);
                const sessionSigner = new LocalAccountSigner(sessionAccount);

                this._sessionPrivateKey = stored.privateKey;
                this._sessionKeyAddress = sessionAccount.address;
                this._sessionExpirySec = stored.expirySec;
                this._sessionContext = stored.context;
                this._sessionClient = createSmartWalletClient({
                    chain: alchemyChain as any,
                    signer: sessionSigner as any,
                    policyId: this.config.paymasterPolicyId,
                    transport: alchemy({
                        apiKey: this.config.alchemyApiKey,
                        nodeRpcUrl: this.config.rpcUrl,
                    } as any),
                });
            }

            return account.address;
        } catch (err) {
            console.error('[Rain SDK V2] connect failed:', err);
            throw err;
        }
    }

    /**
     * Triggers MetaMask `wallet_createSession` to grant a generated session key
     * permission to act on behalf of the smart account for SESSION_DURATION_SEC.
     * Persists `{privateKey, context, expirySec}` in IndexedDB so that
     * subsequent `connect()` calls within the expiry skip the popup.
     *
     * Returns the new session details. Safe to call when a session is already
     * active — in that case it returns the existing session without prompting.
     */
    async grantSession(): Promise<{
        privateKey: `0x${string}`;
        sessionKeyAddress: `0x${string}`;
        context: `0x${string}`;
        expirySec: number;
    }> {
        if (!this._client || !this._account || !this._address) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }

        // Already have a valid session — no popup needed.
        if (this.hasActiveSession && this._sessionPrivateKey && this._sessionKeyAddress && this._sessionContext && this._sessionExpirySec) {
            return {
                privateKey: this._sessionPrivateKey,
                sessionKeyAddress: this._sessionKeyAddress,
                context: this._sessionContext,
                expirySec: this._sessionExpirySec,
            };
        }

        if (!this._aaSdk || !this._walletClientLib || !this._viemAccounts || !this._alchemyChain || !this._alchemyTransportFactory) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }

        const { LocalAccountSigner } = this._aaSdk;
        const { createSmartWalletClient } = this._walletClientLib;
        const { generatePrivateKey, privateKeyToAccount } = this._viemAccounts;
        const alchemy = this._alchemyTransportFactory;
        const alchemyChain = this._alchemyChain;

        const privateKey: `0x${string}` = generatePrivateKey();
        const sessionAccount = privateKeyToAccount(privateKey);
        const expirySec = Math.floor(Date.now() / 1000) + SESSION_DURATION_SEC;

        const result = await this._client.grantPermissions({
            account: this._address,
            expirySec,
            key: {
                publicKey: sessionAccount.address,
                type: 'secp256k1',
            },
            permissions: [{ type: 'root' }],
        });

        const context = result.context as `0x${string}`;

        await saveSession(`sessionKeyData:${this._address.toLowerCase()}`, {
            privateKey,
            context,
            expirySec,
            smartAccountAddress: this._address,
        });

        const sessionSigner = new LocalAccountSigner(sessionAccount);
        this._sessionPrivateKey = privateKey;
        this._sessionKeyAddress = sessionAccount.address;
        this._sessionExpirySec = expirySec;
        this._sessionContext = context;
        this._sessionClient = createSmartWalletClient({
            chain: alchemyChain,
            signer: sessionSigner,
            policyId: this.config.paymasterPolicyId,
            transport: alchemy({
                apiKey: this.config.alchemyApiKey,
                nodeRpcUrl: this.config.rpcUrl,
            }),
        });

        return {
            privateKey,
            sessionKeyAddress: sessionAccount.address,
            context,
            expirySec,
        };
    }

    get address() {
        if (!this._address) throw new Error('Rain not connected. Call rain.connect() first.');
        return this._address;
    }

    get client() {
        if (!this._client) throw new Error('Rain not connected. Call rain.connect() first.');
        return this._client;
    }

    /** Public address of the active session key (signs userOps locally — no popup). */
    get sessionKeyAddress(): `0x${string}` | null {
        return this._sessionKeyAddress;
    }

    /** Unix seconds when the current session permission expires. */
    get sessionExpirySec(): number | null {
        return this._sessionExpirySec;
    }

    /** Whether a fresh `connect()` would reuse the existing session (no MetaMask popup). */
    get hasActiveSession(): boolean {
        if (!this._sessionExpirySec) return false;
        return this._sessionExpirySec > Math.floor(Date.now() / 1000);
    }

    /**
     * Sends a raw transaction from the smart account using the granted session
     * key — no MetaMask popup per call. Returns the on-chain transaction hash.
     */
    async sendTransaction(rawTx: RawTransaction): Promise<`0x${string}`> {
        if (!this._client || !this._account) {
            throw new Error('Rain not connected. Call rain.connect() first.');
        }
        if (!this._sessionClient || !this._sessionContext) {
            throw new Error('No active session. Call rain.grantSession() first to grant permission.');
        }

        const { id } = await this._sessionClient.sendCalls({
            from: this._account.address,
            calls: [{
                to: rawTx.to,
                data: rawTx.data,
                value: toHex(rawTx.value ?? 0n),
            }],
            capabilities: {
                permissions: { context: this._sessionContext },
            },
        });

        const status = await this._sessionClient.waitForCallsStatus({ id });
        const txHash = status.receipts?.[0]?.transactionHash;
        if (!txHash) {
            throw new Error(`Smart account call ${id} returned no transaction hash`);
        }
        return txHash as `0x${string}`;
    }

    /**
     * Clear in-memory state. The persisted session in IndexedDB is preserved
     * so reconnecting within the expiry window won't trigger a fresh
     * grantPermissions popup. Call `forgetSession()` to wipe it explicitly.
     */
    disconnect() {
        this._client = null;
        this._sessionClient = null;
        this._account = null;
        this._address = null;
        this._sessionContext = null;
        this._sessionKeyAddress = null;
        this._sessionPrivateKey = null;
        this._sessionExpirySec = null;
        this._aaSdk = null;
        this._walletClientLib = null;
        this._viemAccounts = null;
        this._alchemyChain = null;
        this._alchemyTransportFactory = null;
    }

    async forgetSession() {
        if (this._address) {
            await deleteSession(`sessionKeyData:${this._address.toLowerCase()}`).catch(() => {});
        }
        this.disconnect();
    }
}
