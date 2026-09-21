import { WalletClient } from 'viem';
import { Chain } from 'viem/chains';

export interface RainConfig {
  walletClient: WalletClient;
  /** Required: the RainAA constructor throws without it (gas-sponsored AA). */
  alchemyApiKey: string;
  /** Required: the RainAA constructor throws without it (paymaster policy). */
  paymasterPolicyId: string;
  chain: Chain;
  rpcUrl?: string;
}

export type RainEnvironment = "development" | "stage" | "production";
export interface RainCoreConfig {
  environment?: RainEnvironment;
  rpcUrl?: string;
  apiUrl?: string;
}
