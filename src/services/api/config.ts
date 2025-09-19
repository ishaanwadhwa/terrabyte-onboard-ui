/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

import { ENV_CONFIG } from '../../config/environment';

export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ORGANIZATION_SERVICE: '/organization-service',
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  PARENT_ORG_UUID: '55cb6fcf-e902-445d-ba00-e51a3b7c216f', // Default parent organization UUID
} as const;

export const API_ENDPOINTS = {
  ORGANIZATIONS: {
    BY_UUID: (uuid: string) => `/organizations/uuid/${uuid}`,
    TENANTS: (uuid: string) => `/organizations/tenant/${uuid}`,
    CREATE: (uuid: string) => `/organizations/${uuid}`,
    UPDATE: (uuid: string) => `/organizations/${uuid}`,
    DELETE: (uuid: string) => `/organizations/${uuid}`,
    BULK_DELETE: () => `/organizations/`,
  },
} as const;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
