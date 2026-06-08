import { encodeFunctionData } from "viem";
import { CreateMarketTxParams, RawTransaction } from "../types.js";
import { CreateMarketAbi } from "../../abi/CreateMarketAbi.js";
import { CREATE_MARKET } from "../../constants/contractmethods.js";
import { validateCreateMarketParams } from "./createMarketValidation.js";
import { normalizeBarValues, uploadMetaData } from "./helpers.js";
import { getUserAllowance } from "../../utils/helpers.js";
import { buildApproveRawTx } from "../buildApprovalRawTx.js";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function buildCreateMarketRawTx(
    params: CreateMarketTxParams
): Promise<RawTransaction[]> {
    const {
        isPublic,
        isPublicPoolResolverAi,
        creator,
        startTime,
        endTime,
        no_of_options,
        disputeTimer,
        inputAmountWei,
        barValues,
        baseToken,
        tradingModel,
        factoryContractAddress,
        oracleFixedFeePerOption,
    } = params;
    if (!factoryContractAddress) throw new Error("environment is not set correctly, factory contract address is missing");
    validateCreateMarketParams(params);

    // Approval = liquidity + oracle fixed fee (fee per option * number of options)
    const oracleFee = (oracleFixedFeePerOption ?? 0n) * BigInt(no_of_options);
    const approvalAmount = inputAmountWei + oracleFee;
    const allowance = await getUserAllowance(params);
    const createMarketTransactions: RawTransaction[] = [];
    if (BigInt(allowance) < approvalAmount) {
        const approveTx = buildApproveRawTx({ spender: factoryContractAddress, tokenAddress: baseToken, amount: approvalAmount })
        createMarketTransactions.push(approveTx);
    }
    const normalizeBarValue = normalizeBarValues(barValues);
    const liquidityPercentages = normalizeBarValue.map((v) => BigInt(v));
    const ipfsUrl = await uploadMetaData(params);

    // oracleEndTime is a duration (not absolute), default 3 days
    const oracleEndTime = BigInt(disputeTimer);

    const createMarketParams = {
        isPublic,
        resolverIsAI: isPublicPoolResolverAi,
        poolOwner: creator,
        referrer: ZERO_ADDRESS as `0x${string}`,
        startTime,
        endTime,
        numberOfOptions: no_of_options,
        oracleEndTime,
        ipfsUri: ipfsUrl,
        initialLiquidity: inputAmountWei,
        liquidityPercentages,
        initialYesPrices: params.initialYesPrices ?? liquidityPercentages.map(() => 500000000000000000n),
        baseToken,
        tradingModel: tradingModel ?? 0,
    };

    createMarketTransactions.push({
        to: factoryContractAddress,
        data: encodeFunctionData({
            abi: CreateMarketAbi,
            functionName: CREATE_MARKET,
            args: [createMarketParams],
        }),
        value: 0n,
    });

    return createMarketTransactions;
}
