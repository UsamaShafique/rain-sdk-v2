import { buildApproveRawTx } from './tx/buildApprovalRawTx.js';
import { buildCreateMarketRawTx } from './tx/CreateMarket/buildCreateMarketRawTx.js';
import { buildEnterOptionRawTx } from './tx/buildEnterOptionRawTx.js';
import { buildAddLiquidityRawTx } from './tx/buildAddLiquidityRawTx.js';
import { buildRemoveLiquidityRawTx } from './tx/buildRemoveLiquidityRawTx.js';
import { buildSplitRawTx } from './tx/buildSplitRawTx.js';
import { buildMergeRawTx } from './tx/buildMergeRawTx.js';
import { buildClosePoolAIRawTx, buildClosePoolManualRawTx, buildChooseWinnerRawTx } from './tx/buildClosePoolRawTx.js';
import { buildPlaceBuyOrderRawTx, buildPlaceSellOrderRawTx } from './tx/buildPlaceOrderRawTx.js';
import { buildOpenDisputeRawTx } from './tx/buildOpenDisputeRawTx.js';
import { buildClaimRawTx } from './tx/buildClaimRawTx.js';
import { buildCancelBuyOrdersRawTx, buildCancelSellOrdersRawTx } from './tx/buildCancelOrdersRawTx.js';
import { buildCalculateWinnerRawTx } from './tx/buildCalculateWinnerRawTx.js';
import { getUserActiveBuyOrders, getUserActiveSellOrders, getFirstBuyOrderPrice, getFirstSellOrderPrice, getBuyOrdersAtPrice, getSellOrdersAtPrice, checkOrderExists } from './markets/getOrderInfo.js';
import { ALLOWED_ENVIRONMENTS, ENV_CONFIG, getRandomRpc } from './config/environments.js';
import { loginUser } from './auth/login.js';
import { getUserOptionLPShares } from './markets/getUserOptionLPShares.js';
import { getUserOptionShares } from './markets/getUserOptionShares.js';
import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';
const erc20AllowanceAbi = parseAbi(['function allowance(address owner, address spender) view returns (uint256)']);
export class Rain {
    environment;
    marketFactory;
    apiUrl;
    distute_initial_timer;
    oracleFixedFeePerOption;
    rpcUrl;
    constructor(config = {}) {
        const { environment = "development", rpcUrl, apiUrl } = config;
        function isValidEnvironment(env) {
            return ALLOWED_ENVIRONMENTS.includes(env);
        }
        if (!isValidEnvironment(environment)) {
            throw new Error(`Invalid environment "${environment}". Allowed values: ${ALLOWED_ENVIRONMENTS.join(", ")}`);
        }
        this.environment = environment;
        this.rpcUrl = rpcUrl ?? getRandomRpc();
        const envConfig = ENV_CONFIG[this.environment];
        this.marketFactory = envConfig.market_factory_address;
        this.apiUrl = apiUrl ?? envConfig.apiUrl;
        this.distute_initial_timer = envConfig.dispute_initial_timer;
        this.oracleFixedFeePerOption = envConfig.oracle_fixed_fee_per_option;
    }
    buildApprovalTx(params) {
        return buildApproveRawTx(params);
    }
    buildCreateMarketTx(params) {
        return buildCreateMarketRawTx({ ...params, factoryContractAddress: this.marketFactory, apiUrl: this.apiUrl, rpcUrl: this.rpcUrl, disputeTimer: this.distute_initial_timer, oracleFixedFeePerOption: this.oracleFixedFeePerOption });
    }
    buildEnterOptionTx(params) {
        return buildEnterOptionRawTx(params);
    }
    buildAddLiquidityTx(params) {
        return buildAddLiquidityRawTx(params);
    }
    buildRemoveLiquidityTx(params) {
        return buildRemoveLiquidityRawTx(params);
    }
    async getUserOptionLPShares(params) {
        return getUserOptionLPShares({ ...params, rpcUrl: this.rpcUrl });
    }
    async getUserOptionShares(params) {
        return getUserOptionShares({ ...params, rpcUrl: this.rpcUrl });
    }
    buildSplitTx(params) {
        return buildSplitRawTx(params);
    }
    buildMergeTx(params) {
        return buildMergeRawTx(params);
    }
    async buildClosePoolAITx(params) {
        return buildClosePoolAIRawTx({ ...params, rpcUrl: this.rpcUrl });
    }
    async buildClosePoolManualTx(params) {
        return buildClosePoolManualRawTx({ ...params, rpcUrl: this.rpcUrl });
    }
    buildChooseWinnerTx(params) {
        return buildChooseWinnerRawTx(params);
    }
    buildPlaceBuyOrderTx(params) {
        return buildPlaceBuyOrderRawTx(params);
    }
    buildPlaceSellOrderTx(params) {
        return buildPlaceSellOrderRawTx(params);
    }
    async buildOpenDisputeTx(params) {
        return buildOpenDisputeRawTx({ ...params, rpcUrl: this.rpcUrl });
    }
    async buildCalculateWinnerTx(params) {
        return buildCalculateWinnerRawTx({ ...params, rpcUrl: this.rpcUrl });
    }
    buildClaimTx(params) {
        return buildClaimRawTx(params);
    }
    buildCancelBuyOrdersTx(params) {
        return buildCancelBuyOrdersRawTx(params);
    }
    buildCancelSellOrdersTx(params) {
        return buildCancelSellOrdersRawTx(params);
    }
    async getUserActiveBuyOrders(params) {
        return getUserActiveBuyOrders({ ...params, rpcUrl: this.rpcUrl });
    }
    async getUserActiveSellOrders(params) {
        return getUserActiveSellOrders({ ...params, rpcUrl: this.rpcUrl });
    }
    async getFirstBuyOrderPrice(params) {
        return getFirstBuyOrderPrice({ ...params, rpcUrl: this.rpcUrl });
    }
    async getFirstSellOrderPrice(params) {
        return getFirstSellOrderPrice({ ...params, rpcUrl: this.rpcUrl });
    }
    async getBuyOrdersAtPrice(params) {
        return getBuyOrdersAtPrice({ ...params, rpcUrl: this.rpcUrl });
    }
    async getSellOrdersAtPrice(params) {
        return getSellOrdersAtPrice({ ...params, rpcUrl: this.rpcUrl });
    }
    async checkOrderExists(params) {
        return checkOrderExists({ ...params, rpcUrl: this.rpcUrl });
    }
    async login(params) {
        return loginUser({ ...params, apiUrl: this.apiUrl });
    }
    async getTokenAllowance(params) {
        const publicClient = createPublicClient({
            chain: arbitrum,
            transport: http(this.rpcUrl),
        });
        const allowance = await publicClient.readContract({
            address: params.tokenAddress,
            abi: erc20AllowanceAbi,
            functionName: 'allowance',
            args: [params.owner, params.spender],
        });
        return allowance;
    }
    getEnvironmentConfig() {
        return ENV_CONFIG[this.environment];
    }
}
