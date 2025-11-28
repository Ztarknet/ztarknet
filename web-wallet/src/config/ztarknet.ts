import { constants } from "starknet";

export interface ZtarknetConfig {
  rpcUrl: string;
  chainId: string;
  accountClassHash: string;
}

export const ZTARKNET_NETWORKS = {
  ZTARKNET_TESTNET: {
    name: "Ztarknet Testnet",
    chainId: "0x534e5f5345504f4c4941",
    rpcUrl: "https://ztarknet-madara.d.karnot.xyz",
    accountClassHash: import.meta.env.VITE_ZTARKNET_ACCOUNT_CLASS_HASH ||
      "0x01484c93b9d6cf61614d698ed069b3c6992c32549194fc3465258c2194734189"
  },
  ZTARKNET_MADARA: {
    name: "Ztarknet Madara Local",
    chainId: "0x5a5441524b4e4554",
    rpcUrl: "http://localhost:9944",
    accountClassHash: import.meta.env.VITE_ZTARKNET_ACCOUNT_CLASS_HASH ||
      "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6"
  }
} as const;

export type ZtarknetNetworkType = keyof typeof ZTARKNET_NETWORKS;

export const getCurrentNetwork = (): ZtarknetNetworkType => {
  const network = import.meta.env.VITE_ZTARKNET_NETWORK as ZtarknetNetworkType;
  return network && network in ZTARKNET_NETWORKS ? network : "ZTARKNET_TESTNET";
};

export const getNetworkConfig = (): ZtarknetConfig => {
  const network = getCurrentNetwork();
  return ZTARKNET_NETWORKS[network];
};

// Username registry contract address (uses the same contract as art/peace for now)
export const USERNAME_REGISTRY_CONTRACT_ADDRESS =
  import.meta.env.VITE_USERNAME_REGISTRY_CONTRACT_ADDRESS ||
  "0x011195b78f3765b1b8cfe841363e60f2335adf67af2443364d4b15cf8dff60ac";

// App name for storage namespacing
export const APP_NAME = "webwallet";

// Account class name for storage identification
export const ACCOUNT_CLASS_NAME = "ztarknet";

// Storage keys for local storage
export const STORAGE_KEYS = {
  // Current active account
  ACCOUNT_ADDRESS: "ztarknet_account_address",
  ACCOUNT_PRIVATE_KEY: "ztarknet_account_private_key",

  // Key identifier list - stores composite keys, NOT private keys
  // Format: ztarknet.{network}.{appName}.keys
  AVAILABLE_KEYS: (network: string) => `ztarknet.${network}.${APP_NAME}.keys`,

  // Individual private key storage
  // Format: {network}.{appName}.{accountClassName}.{address}
  PRIVATE_KEY: (network: string, address: string) =>
    `${network}.${APP_NAME}.${ACCOUNT_CLASS_NAME}.${address}`
};
