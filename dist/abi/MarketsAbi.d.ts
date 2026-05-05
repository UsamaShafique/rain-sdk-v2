export declare const MarketsAbi: readonly [{
    readonly type: "function";
    readonly name: "APPEAL_FEE_MIN";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DISPUTE_FEE_MAX";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DISPUTE_FEE_MIN";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "DISPUTE_WINDOW";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "FACTORY";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "FEE_MAGNIFICATION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ORDER_EXECUTION_FEE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PRICE_MAGNIFICATION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RESOLUTION_FEE_MAX";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RESOLUTION_FEE_MIN";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "TICK_SPACING";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ammNoReserve";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ammYesReserve";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "baseToken";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "baseTokenDecimals";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "buyOrders";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "headIndex";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "tailIndex";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "count";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "isInitialized";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "calculateBaseTokenOracleFixedFee";
    readonly inputs: readonly [{
        readonly name: "oracleFixedFee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "tokenData";
        readonly type: "tuple";
        readonly internalType: "struct IRainDeployer.TokenData";
        readonly components: readonly [{
            readonly name: "tokenPool";
            readonly type: "uint8";
            readonly internalType: "enum IRainDeployer.TokenPool";
        }, {
            readonly name: "isAllowed";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "routerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "routerHelper";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "pathUSDTToToken";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "pathTokenToUSDT";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "pathTokenWETH";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "cancelBuyOrders";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8[]";
        readonly internalType: "uint8[]";
    }, {
        readonly name: "price";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "orderID";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "cancelSellOrders";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8[]";
        readonly internalType: "uint8[]";
    }, {
        readonly name: "price";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "orderID";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "chooseWinner";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "claim";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "closePool";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "closePool";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedWinner";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "closingFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "creatorFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disputeResolver";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "endTime";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "enterLiquidity";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "totalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "enterLiquidityBatch";
    readonly inputs: readonly [{
        readonly name: "totalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "percentages";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "enterOption";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "feePerLPShareX128";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "firstBuyOrderPrice";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "firstSellOrderPrice";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getAmountRequired";
    readonly inputs: readonly [{
        readonly name: "targetPrice";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "requiredAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getCreatorReward";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "creatorReward";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getCurrentPrice";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getDisputeAppealFee";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "disputeFee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getDynamicPayout";
    readonly inputs: readonly [{
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "dynamicPayout";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getEntryShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "returnedShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "expectedReward";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getImpactedPrice";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getLiquidityReward";
    readonly inputs: readonly [{
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "liquidityReward";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getResolverBondAmount";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "resolverBondAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getResolverReward";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "resolverReward";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getReturnedLiquidity";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "totalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "returnedShares";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }, {
        readonly name: "returnedAmounts";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getReturnedShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getSharesReward";
    readonly inputs: readonly [{
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "sharesReward";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ipfsUri";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isOptionAppealed";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isOptionDisputed";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isPublic";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "liquidityFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "merge";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "numberOfOptions";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "openDispute";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "optionAppeal";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "disputeFee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "disputedWinner";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "disputer";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "appealResolver";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionClaimed";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionClosingShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionCreatorShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionDispute";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "disputeFee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "disputedWinner";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "disputer";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_disputeResolver";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionEndTime";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionEndTimeCache";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionFinalized";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionFirstClaim";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionOrderBookShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionPerSideFunds";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionPerSideShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionPlatformShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionProposedWinner";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionResolutionProposer";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionResolved";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionResolver";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionResolverBond";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionResolverShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionState";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "enum Types.PoolState";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionTotalFunds";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionTotalShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionWinner";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optionWinningPoolShare";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "oracleEndTime";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "oracleFixedFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "orderBook";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "exists";
        readonly type: "bool";
        readonly internalType: "bool";
    }, {
        readonly name: "index";
        readonly type: "int256";
        readonly internalType: "int256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ordersAdded";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "ordersRemoved";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "placeBuyOrder";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "orderID";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "placeSellOrder";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "shares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "orderID";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "platformAddress";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "platformFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "poolOwner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "rainToken";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "referrer";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "removeLiquidity";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "lpShares";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "resolver";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "resolverIsAI";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "resolverShareUSDT";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "resultResolverFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "sellOrders";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "headIndex";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "tailIndex";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "count";
        readonly type: "int256";
        readonly internalType: "int256";
    }, {
        readonly name: "isInitialized";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "split";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "startTime";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "swapOracleFixedFee";
    readonly inputs: readonly [{
        readonly name: "baseToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "tokenData";
        readonly type: "tuple";
        readonly internalType: "struct IRainDeployer.TokenData";
        readonly components: readonly [{
            readonly name: "tokenPool";
            readonly type: "uint8";
            readonly internalType: "enum IRainDeployer.TokenPool";
        }, {
            readonly name: "isAllowed";
            readonly type: "bool";
            readonly internalType: "bool";
        }, {
            readonly name: "routerAddress";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "routerHelper";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "pathUSDTToToken";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "pathTokenToUSDT";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }, {
            readonly name: "pathTokenWETH";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "tokenData";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "tokenPool";
        readonly type: "uint8";
        readonly internalType: "enum IRainDeployer.TokenPool";
    }, {
        readonly name: "isAllowed";
        readonly type: "bool";
        readonly internalType: "bool";
    }, {
        readonly name: "routerAddress";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "routerHelper";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "pathUSDTToToken";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "pathTokenToUSDT";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "pathTokenToWETH";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "tooEarly";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "totalMarketFunds";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalMarketShares";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalOptionLPShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalOrders";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "tradingModel";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "enum Types.TradingModel";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "usdt";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userActiveBuyOrders";
    readonly inputs: readonly [{
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userActiveSellOrders";
    readonly inputs: readonly [{
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userFeeDebtX128";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userFundsPerSideInEscrow";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userOptionLPShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userOptionPerSideShares";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "userSharesPerSideInEscrow";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }, {
        readonly name: "user";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "AddLiquidity";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "baseAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "lpShares";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "AppealFeeRefunded";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "appealer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "appealFee";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "appealedWinner";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "CancelBuyOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "orderBaseAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderCreator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "CancelSellOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderCreator";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChooseWinner";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "platformShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "winningShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChooseWinnerAppeal";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "platformShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "winningShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChooseWinnerDispute";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "platformShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "winningShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Claim";
    readonly inputs: readonly [{
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "winnerSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "winningReward";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClaimSwapFees";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClosePool";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "side";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ClosingShareClaim";
    readonly inputs: readonly [{
        readonly name: "closer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "closingShare";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "CreateOracle";
    readonly inputs: readonly [{
        readonly name: "creatorContract";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "createdContract";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "CreatorClaim";
    readonly inputs: readonly [{
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "DisputeFeeRefunded";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "disputer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "disputeFee";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "disputedWinner";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "EnterOption";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "baseAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ExecuteBuyOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "baseAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "maker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "taker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ExecuteSellOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "baseAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "maker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "taker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Merge";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OpenAppeal";
    readonly inputs: readonly [{
        readonly name: "caller";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "currentWinner";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "appealFee";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OpenDispute";
    readonly inputs: readonly [{
        readonly name: "caller";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "currentWinner";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "disputeFee";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "PlaceBuyOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "maker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "PlaceSellOrder";
    readonly inputs: readonly [{
        readonly name: "orderOption";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderOptionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "orderPrice";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "sharesAmount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "orderID";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "maker";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "PlatformClaim";
    readonly inputs: readonly [{
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Price";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "yesReserve";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "noReserve";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionTotalFunds";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RainTokenBurned";
    readonly inputs: readonly [{
        readonly name: "amountBurned";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ReferrerClaim";
    readonly inputs: readonly [{
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "RemoveLiquidity";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "lpShares";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "baseTokensReturned";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "yesReturned";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "noReturned";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "feesEarned";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ResolutionProposed";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "resolutionProposer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "resolverBond";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedWinner";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ResolutionProposerRefund";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "optionSide";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }, {
        readonly name: "resolutionProposer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "resolverBond";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedWinner";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ResolverClaim";
    readonly inputs: readonly [{
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ResolverSet";
    readonly inputs: readonly [{
        readonly name: "resolver";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Split";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "wallet";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "TooEarly";
    readonly inputs: readonly [{
        readonly name: "option";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "resolutionProposer";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "resolverBond";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "proposedWinner";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AlreadyClaimed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyInitialized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ArrayLengthMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "CallerNotOrderPlacer";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "DisputeAlreadyOpened";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "DisputeWindowEnded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "DisputeWindowNotEnded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EndPriceTooHigh";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EndPriceTooLow";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "EndTImeLessThanStartTime";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "IneligibleToClaim";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientAmount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientLPShares";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InsufficientUserShares";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidAmount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidCaller";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidInitialLiquidity";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidLiquidityPercentage";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidOption";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidOptions";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidOracleFixedFee";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidPoolState";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidPrice";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSide";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "LinkedListNotInitalized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "MaximumOptionsExceeded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoIncreaseNeeded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoOwnerSet";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoPlatformSet";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoRewardToClaim";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoTokenSet";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NotPoolManager";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OnlyAuthority";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OnlyOwner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OnlyResolver";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OracleNotFinalized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OrderAlreadyExists";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OrderDoesNotExist";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PoolClosed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PoolNotClosed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PoolOpen";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SaleNotLive";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "SaleStillLive";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "StartTimeEnded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UserBuyOrderExist";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UserBuyOrderLimitReached";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UserSellOrderExist";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UserSellOrderLimitReached";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "VotingEnded";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "WinnerAlreadyFinalized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "WinnerNotDecided";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "WinnerOutOfBound";
    readonly inputs: readonly [];
}];
