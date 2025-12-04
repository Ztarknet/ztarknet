'use client';

import {
  FEE_TOKEN_ADDRESS,
  STORAGE_KEYS,
  USERNAME_REGISTRY_CONTRACT_ADDRESS,
  getCurrentNetwork,
  getNetworkConfig,
} from '@/config/ztarknet';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type constants,
  Account,
  type Call,
  Contract,
  type InvokeFunctionResponse,
  RpcProvider,
  ec,
  hash,
  uint256,
} from 'starknet';

interface ZtarknetContextType {
  account: Account | null;
  address: string | null;
  isConnected: boolean;
  provider: RpcProvider | null;
  username: string | null;

  // Account management
  createAccount: () => Promise<{ address: string; privateKey: string }>;
  connectStorageAccount: (privateKey: string) => Promise<void>;
  storeKeyAndConnect: (privateKey: string) => Promise<void>;
  mintFunds: (toAddress: string, amount: string) => Promise<void>;
  setFundingCallback: (callback: ((address: string) => Promise<void>) | null) => void;

  // Storage management
  getAvailableKeys: () => string[];
  getPrivateKey: (keyId: string) => string | null;
  storePrivateKey: (privateKey: string, address: string) => string;
  clearPrivateKey: (keyId: string) => void;
  clearPrivateKeys: () => void;
  disconnectAccount: () => void;

  // Contract interaction
  invokeContract: (call: Call) => Promise<InvokeFunctionResponse>;
  invokeContractCalls: (calls: Call[]) => Promise<InvokeFunctionResponse>;

  // Username management
  getUsernameForAddress: (userAddress: string) => Promise<string | null>;
  getUsernamesForAddresses: (userAddresses: string[]) => Promise<Map<string, string>>;
  claimUsername: (username: string) => Promise<string | null>;
  isUsernameClaimed: (username: string) => Promise<boolean>;
  refreshUsername: () => Promise<void>;

  // Utility
  deployAccount: (privateKey: string, accountAddress: string) => Promise<string>;
  getBalance: (accountAddress: string, tokenAddress?: string) => Promise<bigint>;
}

const ZtarknetContext = createContext<ZtarknetContextType | undefined>(undefined);

export const useZtarknet = () => {
  const context = useContext(ZtarknetContext);
  if (!context) {
    throw new Error('useZtarknet must be used within ZtarknetProvider');
  }
  return context;
};

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [
      {
        name: 'account',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [{ type: 'core::integer::u256' }],
    state_mutability: 'view',
  },
];

// Username registry contract ABI
const USERNAME_ABI = [
  {
    name: 'get_username',
    type: 'function',
    inputs: [
      {
        name: 'user',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
    outputs: [{ type: 'core::felt252' }],
    state_mutability: 'view',
  },
  {
    name: 'get_usernames',
    type: 'function',
    inputs: [
      {
        name: 'users',
        type: 'core::array::Span::<core::starknet::contract_address::ContractAddress>',
      },
    ],
    outputs: [{ type: 'core::array::Span::<core::felt252>' }],
    state_mutability: 'view',
  },
  {
    name: 'claim_username',
    type: 'function',
    inputs: [
      {
        name: 'username',
        type: 'core::felt252',
      },
    ],
    outputs: [],
    state_mutability: 'external',
  },
  {
    name: 'is_username_claimed',
    type: 'function',
    inputs: [
      {
        name: 'username',
        type: 'core::felt252',
      },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'view',
  },
];

// Helper function to convert felt252 to string
const felt252ToString = (felt: bigint): string => {
  if (!felt || felt === BigInt(0)) return '';

  let str = '';
  let num = felt;
  while (num > BigInt(0)) {
    const char = Number(num % BigInt(256));
    if (char === 0) break;
    str = String.fromCharCode(char) + str;
    num = num / BigInt(256);
  }
  return str;
};

// Helper function to convert string to felt252
const stringToFelt252 = (str: string): string => {
  if (!str) return '0x0';

  let felt = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    felt = felt * BigInt(256) + BigInt(char);
  }
  return `0x${felt.toString(16)}`;
};

// Generate a random private key
function generatePrivateKey(): string {
  const randomBytes = new Uint8Array(31);
  crypto.getRandomValues(randomBytes);
  const hexString = `0x${Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`;
  return hexString;
}

// Calculate account address from private key
const calculateAccountAddress = (privateKey: string, classHash: string): string => {
  const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
  const constructorCalldata = [starkKeyPub];
  const contractAddress = hash.calculateContractAddressFromHash(
    starkKeyPub,
    classHash,
    constructorCalldata,
    0
  );
  return contractAddress;
};

// Generate a composite key identifier for storage
const generateKeyId = (address: string): string => {
  const network = getCurrentNetwork();
  return STORAGE_KEYS.PRIVATE_KEY(network, address);
};

interface ZtarknetProviderProps {
  children: ReactNode;
}

export function ZtarknetProvider({ children }: ZtarknetProviderProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<RpcProvider | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const fundingCallbackRef = useRef<((address: string) => Promise<void>) | null>(null);

  // Initialize provider
  const initializeProvider = useCallback(() => {
    const config = getNetworkConfig();
    const newProvider = new RpcProvider({
      nodeUrl: config.rpcUrl,
      chainId: config.chainId as constants.StarknetChainId,
      blockIdentifier: 'latest',
    });
    setProvider(newProvider);
    return newProvider;
  }, []);

  // Storage management functions
  const getAvailableKeys = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const network = getCurrentNetwork();
      const storedKeys = localStorage.getItem(STORAGE_KEYS.AVAILABLE_KEYS(network));
      if (storedKeys) {
        const parsed = JSON.parse(storedKeys);
        // Filter out any null/undefined/non-string values
        return Array.isArray(parsed)
          ? parsed.filter((k): k is string => typeof k === 'string' && k.length > 0)
          : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to retrieve available keys:', error);
      return [];
    }
  }, []);

  const storePrivateKey = useCallback(
    (privateKey: string, addr: string): string => {
      if (typeof window === 'undefined') return '';
      try {
        const network = getCurrentNetwork();
        const keyId = generateKeyId(addr);

        localStorage.setItem(keyId, privateKey);

        const availableKeys = getAvailableKeys();
        if (!availableKeys.includes(keyId)) {
          const updatedKeys = [...availableKeys, keyId];
          localStorage.setItem(STORAGE_KEYS.AVAILABLE_KEYS(network), JSON.stringify(updatedKeys));
        }

        localStorage.setItem(STORAGE_KEYS.ACCOUNT_PRIVATE_KEY, privateKey);
        localStorage.setItem(STORAGE_KEYS.ACCOUNT_ADDRESS, addr);

        console.log(`Private key stored with ID: ${keyId}`);
        return keyId;
      } catch (error) {
        console.error('Failed to store private key:', error);
        throw new Error('Failed to securely store account credentials');
      }
    },
    [getAvailableKeys]
  );

  const getPrivateKey = useCallback((keyId: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const privateKey = localStorage.getItem(keyId);
      return privateKey;
    } catch (error) {
      console.error('Failed to retrieve private key:', error);
      return null;
    }
  }, []);

  const clearPrivateKey = useCallback(
    (keyId: string): void => {
      if (typeof window === 'undefined') return;
      try {
        const network = getCurrentNetwork();
        localStorage.removeItem(keyId);

        const availableKeys = getAvailableKeys();
        const updatedKeys = availableKeys.filter((k) => k !== keyId);
        localStorage.setItem(STORAGE_KEYS.AVAILABLE_KEYS(network), JSON.stringify(updatedKeys));

        console.log(`Private key removed: ${keyId}`);
      } catch (error) {
        console.error('Failed to clear private key:', error);
      }
    },
    [getAvailableKeys]
  );

  const clearPrivateKeys = useCallback((): void => {
    if (typeof window === 'undefined') return;
    try {
      const network = getCurrentNetwork();
      const availableKeys = getAvailableKeys();

      for (const keyId of availableKeys) {
        localStorage.removeItem(keyId);
      }

      localStorage.removeItem(STORAGE_KEYS.AVAILABLE_KEYS(network));
      localStorage.removeItem(STORAGE_KEYS.ACCOUNT_PRIVATE_KEY);
      localStorage.removeItem(STORAGE_KEYS.ACCOUNT_ADDRESS);

      console.log('All private keys cleared');
    } catch (error) {
      console.error('Failed to clear private keys:', error);
    }
  }, [getAvailableKeys]);

  const getBalance = useCallback(
    async (accountAddress: string, tokenAddress?: string): Promise<bigint> => {
      try {
        const currentProvider = provider || initializeProvider();
        const feeToken = tokenAddress || FEE_TOKEN_ADDRESS;

        const tokenContract = new Contract({
          abi: ERC20_ABI,
          address: feeToken,
          providerOrAccount: currentProvider,
        });

        const balance = await tokenContract.balanceOf(accountAddress);
        const balanceValue = uint256.uint256ToBN(balance);

        return balanceValue;
      } catch (error) {
        console.error('Failed to get balance:', error);
        return BigInt(0);
      }
    },
    [provider, initializeProvider]
  );

  const getUsernameForAddress = useCallback(
    async (userAddress: string): Promise<string | null> => {
      try {
        const currentProvider = provider || initializeProvider();

        const usernameContract = new Contract({
          abi: USERNAME_ABI,
          address: USERNAME_REGISTRY_CONTRACT_ADDRESS,
          providerOrAccount: currentProvider,
        });

        const usernameFelt = await usernameContract.get_username(userAddress);
        const usernameStr = felt252ToString(BigInt(usernameFelt));

        return usernameStr || null;
      } catch (error) {
        // Silently handle errors when username registry is not deployed
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (
          !errorMessage.includes('not deployed') &&
          !errorMessage.includes('Contract not found')
        ) {
          console.warn('Failed to get username:', errorMessage);
        }
        return null;
      }
    },
    [provider, initializeProvider]
  );

  const getUsernamesForAddresses = useCallback(
    async (userAddresses: string[]): Promise<Map<string, string>> => {
      const usernameMap = new Map<string, string>();

      if (userAddresses.length === 0) {
        return usernameMap;
      }

      try {
        const currentProvider = provider || initializeProvider();

        const usernameContract = new Contract({
          abi: USERNAME_ABI,
          address: USERNAME_REGISTRY_CONTRACT_ADDRESS,
          providerOrAccount: currentProvider,
        });

        const usernamesFelt = await usernameContract.get_usernames(userAddresses);

        for (let i = 0; i < userAddresses.length; i++) {
          const usernameFelt = usernamesFelt[i];
          const userAddress = userAddresses[i];
          const usernameStr = felt252ToString(BigInt(usernameFelt));
          if (usernameStr && userAddress) {
            usernameMap.set(userAddress, usernameStr);
          }
        }

        return usernameMap;
      } catch (error) {
        // Silently handle errors when username registry is not deployed
        // This is expected on networks without the username registry contract
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('not deployed') || errorMessage.includes('Contract not found')) {
          console.debug('Username registry not deployed, skipping username lookup');
        } else {
          console.warn('Failed to get usernames:', errorMessage);
        }
        return usernameMap;
      }
    },
    [provider, initializeProvider]
  );

  const claimUsername = useCallback(
    async (usernameStr: string): Promise<string | null> => {
      if (!account) {
        throw new Error('No account connected');
      }

      const usernameFelt = stringToFelt252(usernameStr);
      console.log('Claiming username:', usernameStr, 'as felt:', usernameFelt);

      try {
        // Simple execute like the old working code
        const response = await account.execute([
          {
            contractAddress: USERNAME_REGISTRY_CONTRACT_ADDRESS,
            entrypoint: 'claim_username',
            calldata: [usernameFelt],
          },
        ]);

        console.log('Username claim transaction hash:', response.transaction_hash);

        // Wait for transaction confirmation
        if (provider) {
          await provider.waitForTransaction(response.transaction_hash, {
            retryInterval: 100,
          });
        }

        setUsername(usernameStr);
        return response.transaction_hash;
      } catch (error) {
        console.error('Failed to claim username:', error);
        if (error instanceof Error) {
          const errorMsg = error.message.toLowerCase();
          if (errorMsg.includes('not deployed') || errorMsg.includes('contract not found')) {
            throw new Error('Username registry contract not deployed on this network');
          }
        }
        throw new Error('Failed to claim username. Please try again.');
      }
    },
    [account, provider]
  );

  const isUsernameClaimed = useCallback(
    async (usernameStr: string): Promise<boolean> => {
      try {
        const currentProvider = provider || initializeProvider();
        const usernameFelt = stringToFelt252(usernameStr);

        const usernameContract = new Contract({
          abi: USERNAME_ABI,
          address: USERNAME_REGISTRY_CONTRACT_ADDRESS,
          providerOrAccount: currentProvider,
        });

        const isClaimed = await usernameContract.is_username_claimed(usernameFelt);

        return Boolean(isClaimed);
      } catch (error) {
        // Silently handle errors when username registry is not deployed
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (
          !errorMessage.includes('not deployed') &&
          !errorMessage.includes('Contract not found')
        ) {
          console.warn('Failed to check username:', errorMessage);
        }
        return false;
      }
    },
    [provider, initializeProvider]
  );

  const refreshUsername = useCallback(async (): Promise<void> => {
    if (!address) {
      setUsername(null);
      return;
    }

    try {
      const usernameStr = await getUsernameForAddress(address);
      setUsername(usernameStr);
    } catch (error) {
      console.error('Failed to refresh username:', error);
      setUsername(null);
    }
  }, [address, getUsernameForAddress]);

  const setFundingCallback = useCallback(
    (callback: ((address: string) => Promise<void>) | null) => {
      fundingCallbackRef.current = callback;
    },
    []
  );

  const mintFunds = useCallback(async (toAddress: string, _amount: string): Promise<void> => {
    try {
      if (fundingCallbackRef.current) {
        console.log(`Opening funding modal for address: ${toAddress}`);
        await fundingCallbackRef.current(toAddress);
        console.log('Funding completed via modal');
      } else {
        console.log(`Please send funds to this address to continue: ${toAddress}`);

        let userInput = '';
        while (userInput !== 'Done') {
          userInput =
            window.prompt(
              `Please send funds to this address:\n\n${toAddress}\n\nType "Done" when you have completed the transfer:`
            ) || '';

          if (userInput !== 'Done' && userInput !== '') {
            alert('Please type "Done" exactly (case-sensitive) to continue.');
          }
        }

        console.log('Minting completed');
      }
    } catch (error) {
      console.error('Failed to mint funds:', error);
      throw error;
    }
  }, []);

  const deployAccount = useCallback(
    async (privateKey: string, accountAddress: string): Promise<string> => {
      try {
        const config = getNetworkConfig();
        const currentProvider = provider || initializeProvider();

        const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
        const constructorCalldata = [starkKeyPub];

        const accountInstance = new Account({
          provider: currentProvider,
          address: accountAddress,
          signer: privateKey,
          cairoVersion: '1',
          transactionVersion: '0x3',
        });

        console.log('Deploying account...', accountAddress);

        const deployResponse = await accountInstance.deployAccount({
          classHash: config.accountClassHash,
          constructorCalldata,
          addressSalt: starkKeyPub,
        });

        console.log('Account deployment transaction:', deployResponse.transaction_hash);

        await currentProvider.waitForTransaction(deployResponse.transaction_hash, {
          retryInterval: 100,
        });

        console.log('Account deployed successfully!');
        return deployResponse.transaction_hash;
      } catch (error) {
        console.error('Failed to deploy account:', error);
        throw error;
      }
    },
    [provider, initializeProvider]
  );

  const createAccount = useCallback(async (): Promise<{ address: string; privateKey: string }> => {
    try {
      const config = getNetworkConfig();
      const privateKey = generatePrivateKey();
      const accountAddress = calculateAccountAddress(privateKey, config.accountClassHash);
      console.log('Creating new account:', accountAddress);

      const fundingAmount = '100000000000000000';
      await mintFunds(accountAddress, fundingAmount);
      console.log('Account funded, proceeding to deploy...');

      await deployAccount(privateKey, accountAddress);

      storePrivateKey(privateKey, accountAddress);

      console.log('Account deployed:', {
        address: accountAddress,
        privateKey: `${privateKey.substring(0, 10)}...`,
      });

      return { address: accountAddress, privateKey };
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }, [mintFunds, deployAccount, storePrivateKey]);

  const connectStorageAccount = useCallback(
    async (privateKey: string): Promise<void> => {
      try {
        const config = getNetworkConfig();
        const currentProvider = provider || initializeProvider();

        const accountAddress = calculateAccountAddress(privateKey, config.accountClassHash);

        const accountInstance = new Account({
          provider: currentProvider,
          address: accountAddress,
          signer: privateKey,
          cairoVersion: '1',
          transactionVersion: '0x3',
        });

        setAccount(accountInstance);
        const paddedAddress = `0x${accountAddress.slice(2).padStart(64, '0')}`;
        setAddress(paddedAddress);
        setProvider(currentProvider);

        console.log('Connected to account:', accountAddress);
      } catch (error) {
        console.error('Failed to connect to storage account:', error);
        throw error;
      }
    },
    [provider, initializeProvider]
  );

  const storeKeyAndConnect = useCallback(
    async (privateKey: string): Promise<void> => {
      try {
        const config = getNetworkConfig();
        const accountAddress = calculateAccountAddress(privateKey, config.accountClassHash);

        storePrivateKey(privateKey, accountAddress);
        await connectStorageAccount(privateKey);

        console.log('Key stored and connected:', accountAddress);
      } catch (error) {
        console.error('Failed to store key and connect:', error);
        throw error;
      }
    },
    [connectStorageAccount, storePrivateKey]
  );

  const disconnectAccount = useCallback(() => {
    setAccount(null);
    setAddress(null);
    console.log('Account disconnected');
  }, []);

  const invokeContract = useCallback(
    async (call: Call): Promise<InvokeFunctionResponse> => {
      if (!account) {
        throw new Error('No account connected');
      }

      try {
        console.log('Invoking contract:', call);

        if (!provider) {
          throw new Error('Provider not initialized');
        }

        const nonce = await provider.getNonceForAddress(account.address, 'pre_confirmed');
        console.log('Using nonce:', nonce);
        const response = await account.execute(call, {
          nonce: nonce,
          skipValidate: true,
          blockIdentifier: 'pre_confirmed',
        });

        console.log('Transaction hash:', response.transaction_hash);

        await provider.waitForTransaction(response.transaction_hash, {
          retryInterval: 100,
        });

        return response;
      } catch (error) {
        console.error('Failed to invoke contract:', error);
        throw error;
      }
    },
    [account, provider]
  );

  const invokeContractCalls = useCallback(
    async (calls: Call[]): Promise<InvokeFunctionResponse> => {
      if (!account) {
        throw new Error('No account connected');
      }

      try {
        console.log('Invoking multiple contract calls:', calls.length);

        if (!provider) {
          throw new Error('Provider not initialized');
        }

        const nonce = await provider.getNonceForAddress(account.address, 'pre_confirmed');
        console.log('Using nonce:', nonce);
        const response = await account.execute(calls, {
          nonce: nonce,
          skipValidate: true,
          blockIdentifier: 'pre_confirmed',
        });

        console.log('Transaction hash:', response.transaction_hash);

        await provider.waitForTransaction(response.transaction_hash, {
          retryInterval: 100,
        });

        return response;
      } catch (error) {
        console.error('Failed to invoke contract calls:', error);
        throw error;
      }
    },
    [account, provider]
  );

  // Refresh username when address changes
  useEffect(() => {
    if (address) {
      refreshUsername();
    } else {
      setUsername(null);
    }
  }, [address, refreshUsername]);

  // Auto-connect on app load if there's an existing account
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only once on mount
  useEffect(() => {
    const autoConnect = async () => {
      if (account) return;

      const availableKeyIds = getAvailableKeys();
      const firstKeyId = availableKeyIds?.[0];
      if (firstKeyId) {
        try {
          const privateKey = getPrivateKey(firstKeyId);
          if (privateKey) {
            await connectStorageAccount(privateKey);
            console.log('Auto-connected to existing account on app load');
          }
        } catch (error) {
          console.error('Failed to auto-connect on app load:', error);
        }
      }
    };

    autoConnect();
  }, []);

  const value: ZtarknetContextType = {
    account,
    address,
    isConnected: !!account && !!address,
    provider,
    username,
    mintFunds,
    createAccount,
    connectStorageAccount,
    storeKeyAndConnect,
    setFundingCallback,
    getAvailableKeys,
    getPrivateKey,
    storePrivateKey,
    clearPrivateKey,
    clearPrivateKeys,
    disconnectAccount,
    invokeContract,
    invokeContractCalls,
    getUsernameForAddress,
    getUsernamesForAddresses,
    claimUsername,
    isUsernameClaimed,
    refreshUsername,
    deployAccount,
    getBalance,
  };

  return <ZtarknetContext.Provider value={value}>{children}</ZtarknetContext.Provider>;
}
