/**
 * Environment Configuration
 * Centralized environment variable management
 */

export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://api.terra-byte.ai'),
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.VITE_NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.VITE_NODE_ENV === 'production',
} as const;
