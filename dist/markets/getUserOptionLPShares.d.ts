export interface GetUserOptionLPSharesParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    userAddress: `0x${string}`;
    rpcUrl: string;
}
export declare function getUserOptionLPShares(params: GetUserOptionLPSharesParams): Promise<bigint>;
