export const ALLOWED_ENVIRONMENTS = ["development", "stage", "production"] as const;
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
        market_factory_address: "0xbbDd9F2436d3F2e88588c6d28630557e8066f02f" as `0x${string}`,
        dispute_initial_timer: 5 * 60,
        tokens: {
            usdt: {
                address: "0xCa4f77A38d8552Dd1D5E44e890173921B67725F4" as `0x${string}`,
                symbol: USDT_SYMBOL_DEV,
                decimals: 6,
                oracle_fixed_fee_per_option: 1_000_000n, // $1 in 6 decimals
            } as TokenConfig,
            rain: {
                address: "0x43976a124e6834b541840Ce741243dAD3dd538DA" as `0x${string}`,
                symbol: "RAIN",
                decimals: 18,
                oracle_fixed_fee_per_option: 1_000_000_000_000_000_000n, // $1 in 18 decimals
            } as TokenConfig,
        },
    },

    stage: {
        apiUrl: "https://stg2-api.rain.one",
        market_factory_address: "0x16ccF044f8AE910888d96e9cae6ba22AFEDE628d" as `0x${string}`,
        dispute_initial_timer: 5 * 60,
        tokens: {
            usdt: {
                address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as `0x${string}`,
                symbol: "USD₮0",
                decimals: 6,
                oracle_fixed_fee_per_option: 1_000_000n,
            } as TokenConfig,
            rain: {
                address: "0x25118290e6A5f4139381D072181157035864099d" as `0x${string}`,
                symbol: "RAIN",
                decimals: 18,
                oracle_fixed_fee_per_option: 1_000_000_000_000_000_000n,
            } as TokenConfig,
        },
    },

    production: {
        apiUrl: "https://prod2-api.rain.one",
        market_factory_address: "0x38B3Ba1ee001E6785224E31b3031ae96CA06C677" as `0x${string}`,
        dispute_initial_timer: 120 * 60,
        tokens: {
            usdt: {
                address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" as `0x${string}`,
                symbol: "USD₮0",
                decimals: 6,
                oracle_fixed_fee_per_option: 1_000_000n,
            } as TokenConfig,
            rain: {
                address: "0x25118290e6A5f4139381D072181157035864099d" as `0x${string}`,
                symbol: "RAIN",
                decimals: 18,
                oracle_fixed_fee_per_option: 1_000_000_000_000_000_000n,
            } as TokenConfig,
        },
    },
} as const;
