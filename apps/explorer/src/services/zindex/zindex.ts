/**
 * Zindex API - Common utilities and configuration
 *
 * Base configuration and helper functions for all Zindex API modules.
 */

import type { QueryParams, ZindexResponse } from '../../types/zindex';

/**
 * Get the Zindex API endpoint from environment or use default
 * Supports Vite environment variable override
 */
export const ZINDEX_ENDPOINT =
  (import.meta as { env?: { VITE_ZINDEX_ENDPOINT?: string } }).env?.VITE_ZINDEX_ENDPOINT ||
  'https://zindex.ztarknet.cash';

/**
 * Base API paths
 */
export const API_VERSION = 'v1';
export const API_BASE = `/api/${API_VERSION}`;

/**
 * Build a full API URL from a path
 */
export function buildUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${ZINDEX_ENDPOINT}${cleanPath}`;
}

/**
 * Build URL with query parameters
 */
export function buildUrlWithParams(path: string, params: QueryParams = {}): string {
  const url = buildUrl(path);
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryParams ? `${url}?${queryParams}` : url;
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Generic API fetch wrapper with error handling
 */
export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    // Check if response has content
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('API returned empty response');
    }

    // Try to parse JSON
    let data: ZindexResponse<T>;
    try {
      data = JSON.parse(text) as ZindexResponse<T>;
    } catch (parseError: unknown) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('API returned invalid JSON response');
    }

    if (data.result === 'error') {
      throw new Error(data.error || 'API returned error');
    }

    if (data.data === undefined) {
      throw new Error('API response missing data field');
    }

    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Zindex API error:', { url, error: error.message });
    } else {
      console.error('Zindex API error:', { url, error });
    }
    throw error;
  }
}

/**
 * Perform a GET request to the Zindex API
 */
export async function apiGet<T>(path: string, params: QueryParams = {}): Promise<T> {
  const url = buildUrlWithParams(path, params);
  return apiFetch<T>(url);
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<unknown> {
  return apiFetch<unknown>(buildUrl('/health'));
}

/**
 * Common pagination defaults
 */
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

/**
 * Apply default pagination parameters
 */
export function withPaginationDefaults(
  params: QueryParams = {},
  defaultLimit = DEFAULT_LIMIT
): QueryParams {
  return {
    ...params,
    limit: params.limit ?? defaultLimit,
    offset: params.offset ?? DEFAULT_OFFSET,
  };
}
