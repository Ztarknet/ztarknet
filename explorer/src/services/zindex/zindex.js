/**
 * Zindex API - Common utilities and configuration
 *
 * Base configuration and helper functions for all Zindex API modules.
 */

/**
 * Get the Zindex API endpoint from environment or use default
 * Supports Vite environment variable override
 */
export const ZINDEX_ENDPOINT = import.meta.env.VITE_ZINDEX_ENDPOINT || 'https://zindex.ztarknet.cash';

/**
 * Base API paths
 */
export const API_VERSION = 'v1';
export const API_BASE = `/api/${API_VERSION}`;

/**
 * Build a full API URL from a path
 * @param {string} path - API path (e.g., '/blocks')
 * @returns {string} Full URL
 */
export function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${ZINDEX_ENDPOINT}${cleanPath}`;
}

/**
 * Build URL with query parameters
 * @param {string} path - API path
 * @param {Object} params - Query parameters
 * @returns {string} Full URL with query string
 */
export function buildUrlWithParams(path, params = {}) {
  const url = buildUrl(path);
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryParams ? `${url}?${queryParams}` : url;
}

/**
 * Generic API fetch wrapper with error handling
 * @param {string} url - Full URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 * @throws {Error} If request fails or returns error response
 */
export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === 'error') {
      throw new Error(data.error || 'API returned error');
    }

    return data.data;
  } catch (error) {
    console.error('Zindex API error:', error);
    throw error;
  }
}

/**
 * Perform a GET request to the Zindex API
 * @param {string} path - API path
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response data
 */
export async function apiGet(path, params = {}) {
  const url = buildUrlWithParams(path, params);
  return apiFetch(url);
}

/**
 * Check API health
 * @returns {Promise<Object>} Health check response
 */
export async function checkHealth() {
  return apiFetch(buildUrl('/health'));
}

/**
 * Common pagination defaults
 */
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

/**
 * Apply default pagination parameters
 * @param {Object} params - Parameters object
 * @param {number} defaultLimit - Default limit value
 * @returns {Object} Parameters with defaults applied
 */
export function withPaginationDefaults(params = {}, defaultLimit = DEFAULT_LIMIT) {
  return {
    ...params,
    limit: params.limit ?? defaultLimit,
    offset: params.offset ?? DEFAULT_OFFSET,
  };
}
