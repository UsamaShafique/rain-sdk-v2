import { CreateMarketTxParams } from "../types.js";

export function validateCreateMarketParams(params: CreateMarketTxParams) {
    const {
        marketQuestion,
        marketOptions,
        marketTags,
        marketDescription,
        isPublic,
        isPublicPoolResolverAi,
        creator,
        startTime,
        endTime,
        no_of_options,
        inputAmountWei,
        barValues,
        baseToken,
        factoryContractAddress,
        tokenDecimals,
        initialYesPrices,
    } = params;

    // Required field validations
    if (typeof isPublic !== "boolean") throw new Error("isPublic is required and must be a boolean");
    if (typeof isPublicPoolResolverAi !== "boolean")
        throw new Error("isPublicPoolResolverAi is required and must be a boolean");
    if (!creator) throw new Error("creator address is required");
    if (!marketQuestion) throw new Error("question is required");
    if (!marketDescription) throw new Error("description is required");
    if (!Array.isArray(marketOptions) || marketOptions.length < 1 || marketOptions.length > 50) {
        throw new Error("options must be between 1 and 50");
    }
    if (marketOptions.some(opt => !opt?.toString().trim())) {
        throw new Error("options cannot contain empty values");
    }
    if (!Array.isArray(marketTags) || marketTags.length < 1 || marketTags.length > 15) {
        throw new Error("tags must be between 1 and 15");
    }
    if (marketTags.some(tag => !tag?.toString().trim())) {
        throw new Error("tags cannot contain empty values");
    }
    if (!startTime) throw new Error("startTime is required");
    if (!endTime) throw new Error("endTime is required");
    if (!no_of_options)
        throw new Error("number of options is required and cannot be empty");
    if (!inputAmountWei) throw new Error("inputAmountWei is required");
    if (!barValues || !Array.isArray(barValues) || barValues.length === 0)
        throw new Error("barValues array is required and cannot be empty");
    if (!baseToken) throw new Error("baseToken address is required");
    if (!params.marketImage) throw new Error("marketImage is required");
    if (!factoryContractAddress) throw new Error("factoryContractAddress is required");
    const decimals = tokenDecimals ?? 6;
    const oneTokenInWei = 10n ** BigInt(decimals);
    // $0.1 minimum for dev/stage, validation for production handled separately
    const minAmount = oneTokenInWei / 10n; // 0.1 token
    if (inputAmountWei < minAmount) {
        throw new Error("Market cannot be opened: inputAmountWei must be at least $0.1");
    }
    if (startTime >= endTime) throw new Error("startTime must be earlier than endTime");

    // Cross-field validation — these previously slipped through and were silently
    // "fixed" by normalizeBarValues (which dumped the rounding remainder onto the
    // last option, producing odds the caller never asked for). Reject loudly instead.
    const optionCount = Number(no_of_options);
    if (optionCount < 2) throw new Error("no_of_options must be at least 2");
    if (marketOptions.length !== optionCount) {
        throw new Error(`marketOptions length (${marketOptions.length}) must equal no_of_options (${optionCount})`);
    }
    if (barValues.length !== optionCount) {
        throw new Error(`barValues length (${barValues.length}) must equal no_of_options (${optionCount})`);
    }
    if (barValues.some(v => typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100)) {
        throw new Error("each barValue must be a number between 0 and 100");
    }
    const barSum = barValues.reduce((s, v) => s + v, 0);
    if (Math.abs(barSum - 100) > 0.01) {
        throw new Error(`barValues must sum to 100 (got ${barSum})`);
    }
    if (initialYesPrices !== undefined) {
        if (initialYesPrices.length !== optionCount) {
            throw new Error(`initialYesPrices length (${initialYesPrices.length}) must equal no_of_options (${optionCount})`);
        }
        const ONE = 10n ** 18n;
        if (initialYesPrices.some(p => p <= 0n || p >= ONE)) {
            throw new Error("each initialYesPrice must be within (0, 1e18) exclusive");
        }
    }

    return true;
}
