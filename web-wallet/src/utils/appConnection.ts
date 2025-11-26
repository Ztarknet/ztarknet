import { getCurrentNetwork, getNetworkConfig } from "@config/ztarknet";
import { ec, hash } from "starknet";

/**
 * Calculate account address from private key
 * This matches the calculation in ZtarknetConnector
 */
function calculateAccountAddress(privateKey: string): string {
  const config = getNetworkConfig();
  const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
  const constructorCalldata = [starkKeyPub];

  const contractAddress = hash.calculateContractAddressFromHash(
    starkKeyPub,
    config.accountClassHash,
    constructorCalldata,
    0
  );

  return contractAddress;
}

/**
 * Normalize address by removing padding and converting to lowercase
 * This ensures consistent address comparison across different formats
 */
function normalizeAddress(address: string): string {
  // Remove 0x prefix, remove leading zeros, add back 0x, lowercase
  return '0x' + address.slice(2).replace(/^0+/, '').toLowerCase();
}

/**
 * Check if an account is connected to a specific app
 * @param appName - The app name (e.g., "artpeace")
 * @param address - The account address to check
 * @returns boolean - True if the account has a stored private key for this app
 */
export function isAccountConnectedToApp(appName: string, address: string): boolean {
  if (!address || !appName) return false;

  try {
    const network = getCurrentNetwork();
    const accountClassName = "ztarknet";
    const normalizedAddr = normalizeAddress(address);

    // Build the storage key for this app's account
    // Format: {network}.{appName}.{accountClassName}.{address}
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;

    // Check if private key exists in localStorage
    const privateKey = localStorage.getItem(storageKey);
    return privateKey !== null;
  } catch (error) {
    console.error("Error checking app connection:", error);
    return false;
  }
}

/**
 * Store a private key for a specific app
 * @param appName - The app name (e.g., "artpeace")
 * @param privateKey - The private key to store
 * @returns The address that was used for storage
 */
export function storeAppPrivateKey(appName: string, privateKey: string): string {
  try {
    const network = getCurrentNetwork();
    const accountClassName = "ztarknet";

    // Calculate the address from the private key to ensure consistency
    // This is the same calculation that both web-wallet and zart-peace use
    const calculatedAddress = calculateAccountAddress(privateKey);
    console.log(`[DEBUG] Raw calculated address: ${calculatedAddress}`);

    const normalizedAddr = normalizeAddress(calculatedAddress);
    console.log(`[DEBUG] Normalized address: ${normalizedAddr}`);

    // Build the storage key
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;
    console.log(`[DEBUG] Storage key: ${storageKey}`);

    // Store the private key
    localStorage.setItem(storageKey, privateKey);
    console.log(`[DEBUG] Stored private key in localStorage`);

    // Update the app's available keys list (storing key IDs, NOT private keys)
    // This ensures the key is added to the app's list without removing other keys
    const availableKeysKey = `ztarknet.${network}.${appName}.keys`;
    console.log(`[DEBUG] Available keys list key: ${availableKeysKey}`);

    const storedKeys = localStorage.getItem(availableKeysKey);
    const availableKeys = storedKeys ? JSON.parse(storedKeys) : [];
    console.log(`[DEBUG] Current available keys:`, availableKeys);

    if (!availableKeys.includes(storageKey)) {
      const updatedKeys = [...availableKeys, storageKey];
      localStorage.setItem(availableKeysKey, JSON.stringify(updatedKeys));
      console.log(`[DEBUG] Updated available keys:`, updatedKeys);
    } else {
      console.log(`[DEBUG] Key already in available keys list`);
    }

    console.log(`✅ Successfully stored account for ${appName}`);
    console.log(`   Address: ${normalizedAddr}`);
    console.log(`   Storage key: ${storageKey}`);

    return normalizedAddr;
  } catch (error) {
    console.error("Error storing app private key:", error);
    throw error;
  }
}

/**
 * Get the private key for a specific app and account
 * @param appName - The app name
 * @param address - The account address
 * @returns string | null - The private key or null if not found
 */
export function getAppPrivateKey(appName: string, address: string): string | null {
  try {
    const network = getCurrentNetwork();
    const accountClassName = "ztarknet";
    const normalizedAddr = normalizeAddress(address);

    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.error("Error getting app private key:", error);
    return null;
  }
}

/**
 * Disconnect an account from a specific app
 * @param appName - The app name (e.g., "artpeace")
 * @param address - The account address to disconnect
 */
export function disconnectFromApp(appName: string, address: string): void {
  try {
    const network = getCurrentNetwork();
    const accountClassName = "ztarknet";
    const normalizedAddr = normalizeAddress(address);

    // Build the storage key
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;

    // Remove the private key
    localStorage.removeItem(storageKey);

    // Update the app's available keys list (remove this key)
    const availableKeysKey = `ztarknet.${network}.${appName}.keys`;
    const storedKeys = localStorage.getItem(availableKeysKey);
    const availableKeys = storedKeys ? JSON.parse(storedKeys) : [];

    const updatedKeys = availableKeys.filter((key: string) => key !== storageKey);

    if (updatedKeys.length > 0) {
      localStorage.setItem(availableKeysKey, JSON.stringify(updatedKeys));
    } else {
      // If no keys left, remove the entire list
      localStorage.removeItem(availableKeysKey);
    }

    console.log(`Disconnected account ${normalizedAddr} from ${appName}`);
  } catch (error) {
    console.error("Error disconnecting from app:", error);
    throw error;
  }
}
