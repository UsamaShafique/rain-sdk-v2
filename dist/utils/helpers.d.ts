import { CreateMarketTxParams } from "../tx/types.js";
export declare const convertToWeiEthers: (value: string | bigint, decimals: number) => bigint;
export declare function isRpcValid(rpcUrl: string | undefined): Promise<boolean>;
export declare function getUserAllowance(params: CreateMarketTxParams): Promise<number>;
