export const ALLOWED_ENVIRONMENTS = ["development", "stage"] as const;
export const DEFAULT_RPCS: string[] = [
    "https://arb1.arbitrum.io/rpc",
    "https://arbitrum-one.publicnode.com",
    "https://rpc.sentio.xyz/arbitrum-one"
]

export function getRandomRpc(): string {
    const index = Math.floor(Math.random() * DEFAULT_RPCS.length);
    return DEFAULT_RPCS[index];
}

export const USDT_SYMBOL_DEV = "USDTm";
// export const USDT_SYMBOL_PROD = "USD₮0";

export interface TokenConfig {
    address: `0x${string}`;
    symbol: string;
    decimals: number;
    oracle_fixed_fee_per_option: bigint; // $1 equivalent per option in token's decimals
}

export const ENV_CONFIG = {
    development: {
        apiUrl: "https://dev2-api.rain.one",
        market_factory_address: "0xBD99441C4116b85dFecA2d6521EC0e2Eb62F0adE" as `0x${string}`,
        dispute_initial_timer: 1 * 60,
        tokens: {
            usdt: {
                address: "0xCa4f77A38d8552Dd1D5E44e890173921B67725F4" as `0x${string}`,
                symbol: USDT_SYMBOL_DEV,
                decimals: 6,
                oracle_fixed_fee_per_option: 1_000_000n, // $1 in 6 decimals
            } as TokenConfig,
            rain: {
                address: "0x25118290e6A5f4139381D072181157035864099d" as `0x${string}`,
                symbol: "RAIN",
                decimals: 18,
                oracle_fixed_fee_per_option: 1_000_000_000_000_000_000n, // $1 in 18 decimals
            } as TokenConfig,
        },
    },

    stage: {
        apiUrl: "https://stg2-api.rain.one",
        market_factory_address: "0x4b936AB5114F3DFa2A010117Afeb47F746842884" as `0x${string}`,
        dispute_initial_timer: 1 * 60,
        tokens: {
            usdt: {
                address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as `0x${string}`,
                symbol: "USD₮0",
                decimals: 6,
                oracle_fixed_fee_per_option: 1_000_000n,
            } as TokenConfig,
            rain: {
                address: "0x43976a124e6834b541840Ce741243dAD3dd538DA" as `0x${string}`,
                symbol: "RAIN",
                decimals: 18,
                oracle_fixed_fee_per_option: 1_000_000_000_000_000_000n,
            } as TokenConfig,
        },
    },

    // production: {
    //     apiUrl: "https://prod-api.rain.one",
    //     market_factory_address: "0xA8640B62D755e42C9ed6A86d0fc65CE09e31F264" as `0x${string}`,
    //     dispute_initial_timer: 120 * 60,
    //     oracle_fixed_fee_per_option: 1_000_000n, // $1 per option (6 decimals)
    //     usdt_symbol: USDT_SYMBOL_PROD,
    //     usdt_token: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as `0x${string}`,
    //     rain_token: "0x43976a124e6834b541840Ce741243dAD3dd538DA" as `0x${string}`,
    // },
} as const;
