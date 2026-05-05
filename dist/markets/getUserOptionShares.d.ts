export interface GetUserOptionSharesParams {
    marketContractAddress: `0x${string}`;
    option: bigint;
    optionSide: number;
    userAddress: `0x${string}`;
    rpcUrl: string;
}
export declare function getUserOptionShares(params: GetUserOptionSharesParams): Promise<bigint>;
