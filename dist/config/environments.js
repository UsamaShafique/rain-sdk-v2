export const ALLOWED_ENVIRONMENTS = ["development", "stage", "production"];
export const DEFAULT_RPCS = [
    "https://arb1.arbitrum.io/rpc",
    "https://arbitrum-one.publicnode.com",
    "https://rpc.sentio.xyz/arbitrum-one"
];
export function getRandomRpc() {
    const index = Math.floor(Math.random() * DEFAULT_RPCS.length);
    return DEFAULT_RPCS[index];
}
export const USDT_SYMBOL_DEV = "USDTm";
export const USDT_SYMBOL_PROD = "USD₮0";
export const ENV_CONFIG = {
    development: {
        apiUrl: "https://dev-api.rain.one",
        market_factory_address: "0xBD99441C4116b85dFecA2d6521EC0e2Eb62F0adE",
        dispute_initial_timer: 1 * 60,
        oracle_fixed_fee_per_option: 1000000n, // $1 per option (6 decimals)
        usdt_symbol: USDT_SYMBOL_DEV,
        usdt_token: "0xCa4f77A38d8552Dd1D5E44e890173921B67725F4",
        rain_token: "0x25118290e6A5f4139381D072181157035864099d",
    },
    stage: {
        apiUrl: "https://stg-api.rain.one",
        market_factory_address: "0xD4900CA167228365806FBA4cB21f7EAe8b6d96BE",
        dispute_initial_timer: 1 * 60,
        oracle_fixed_fee_per_option: 1000000n, // $1 per option (6 decimals)
        usdt_symbol: USDT_SYMBOL_PROD,
        usdt_token: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        rain_token: "0x43976a124e6834b541840Ce741243dAD3dd538DA",
    },
    production: {
        apiUrl: "https://prod-api.rain.one",
        market_factory_address: "0xA8640B62D755e42C9ed6A86d0fc65CE09e31F264",
        dispute_initial_timer: 120 * 60,
        oracle_fixed_fee_per_option: 1000000n, // $1 per option (6 decimals)
        usdt_symbol: USDT_SYMBOL_PROD,
        usdt_token: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        rain_token: "0x43976a124e6834b541840Ce741243dAD3dd538DA",
    },
};
