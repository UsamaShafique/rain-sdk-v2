export declare const ALLOWED_ENVIRONMENTS: readonly ["development", "stage", "production"];
export declare const DEFAULT_RPCS: string[];
export declare function getRandomRpc(): string;
export declare const USDT_SYMBOL_DEV = "USDTm";
export declare const USDT_SYMBOL_PROD = "USD\u20AE0";
export declare const ENV_CONFIG: {
    readonly development: {
        readonly apiUrl: "https://dev-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USDTm";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    };
    readonly stage: {
        readonly apiUrl: "https://stg-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USD₮0";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    };
    readonly production: {
        readonly apiUrl: "https://prod-api.rain.one";
        readonly market_factory_address: `0x${string}`;
        readonly dispute_initial_timer: number;
        readonly oracle_fixed_fee_per_option: 1000000n;
        readonly usdt_symbol: "USD₮0";
        readonly usdt_token: `0x${string}`;
        readonly rain_token: `0x${string}`;
    };
};
