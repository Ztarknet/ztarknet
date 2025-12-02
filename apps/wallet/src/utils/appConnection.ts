import { getCurrentNetwork, getNetworkConfig } from '@/config/ztarknet';
import { ec, hash } from 'starknet';

/**
 * Calculate account address from private key
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
 */
function normalizeAddress(address: string): string {
  if (!address) return '';
  return `0x${address.slice(2).replace(/^0+/, '').toLowerCase()}`;
}

/**
 * Check if an account is connected to a specific app
 */
export function isAccountConnectedToApp(
  appName: string | null | undefined,
  address: string | null | undefined
): boolean {
  if (typeof window === 'undefined') return false;
  if (!address || !appName) return false;

  try {
    const network = getCurrentNetwork();
    const accountClassName = 'ztarknet';
    const normalizedAddr = normalizeAddress(address);
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;
    const privateKey = localStorage.getItem(storageKey);
    return privateKey !== null;
  } catch (error) {
    console.error('Error checking app connection:', error);
    return false;
  }
}

/**
 * Store a private key for a specific app
 */
export function storeAppPrivateKey(appName: string | null | undefined, privateKey: string): string {
  if (typeof window === 'undefined' || !appName) return '';

  try {
    const network = getCurrentNetwork();
    const accountClassName = 'ztarknet';
    const calculatedAddress = calculateAccountAddress(privateKey);
    const normalizedAddr = normalizeAddress(calculatedAddress);
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;

    localStorage.setItem(storageKey, privateKey);

    const availableKeysKey = `ztarknet.${network}.${appName}.keys`;
    const storedKeys = localStorage.getItem(availableKeysKey);
    const availableKeys: string[] = storedKeys ? JSON.parse(storedKeys) : [];

    if (!availableKeys.includes(storageKey)) {
      const updatedKeys = [...availableKeys, storageKey];
      localStorage.setItem(availableKeysKey, JSON.stringify(updatedKeys));
    }

    return normalizedAddr;
  } catch (error) {
    console.error('Error storing app private key:', error);
    throw error;
  }
}

/**
 * Get the private key for a specific app and account
 */
export function getAppPrivateKey(
  appName: string | null | undefined,
  address: string | null | undefined
): string | null {
  if (typeof window === 'undefined' || !appName || !address) return null;

  try {
    const network = getCurrentNetwork();
    const accountClassName = 'ztarknet';
    const normalizedAddr = normalizeAddress(address);
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.error('Error getting app private key:', error);
    return null;
  }
}

/**
 * Disconnect an account from a specific app
 */
export function disconnectFromApp(
  appName: string | null | undefined,
  address: string | null | undefined
): void {
  if (typeof window === 'undefined' || !appName || !address) return;

  try {
    const network = getCurrentNetwork();
    const accountClassName = 'ztarknet';
    const normalizedAddr = normalizeAddress(address);
    const storageKey = `${network}.${appName}.${accountClassName}.${normalizedAddr}`;

    localStorage.removeItem(storageKey);

    const availableKeysKey = `ztarknet.${network}.${appName}.keys`;
    const storedKeys = localStorage.getItem(availableKeysKey);
    const availableKeys: string[] = storedKeys ? JSON.parse(storedKeys) : [];

    const updatedKeys = availableKeys.filter((key) => key !== storageKey);

    if (updatedKeys.length > 0) {
      localStorage.setItem(availableKeysKey, JSON.stringify(updatedKeys));
    } else {
      localStorage.removeItem(availableKeysKey);
    }
  } catch (error) {
    console.error('Error disconnecting from app:', error);
    throw error;
  }
}
