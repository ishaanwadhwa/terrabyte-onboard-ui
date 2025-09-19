/**
 * Organization API Service
 * Service for handling organization-related API calls
 */

import { apiClient } from './client';
import { API_CONFIG, API_ENDPOINTS } from './config';
import type {
  Organization,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from './types/organization';

class OrganizationService {
  private basePath = API_CONFIG.ORGANIZATION_SERVICE;

  /**
   * Get organization by UUID
   * @param uuid - Organization UUID
   * @returns Promise<Organization>
   */
  async getOrganizationByUuid(uuid: string): Promise<Organization> {
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.BY_UUID(uuid)}`;
    console.log('Organization Service - Getting organization by UUID:', uuid, 'Endpoint:', endpoint);
    const response = await apiClient.get<Organization>(endpoint);
    console.log('Organization Service - Response received:', response);
    return response.data;
  }

  /**
   * Get all tenant organizations for a given parent UUID
   * @param parentUuid - Parent organization UUID
   * @returns Promise<Organization[]>
   */
  async getTenants(parentUuid: string): Promise<Organization[]> {
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.TENANTS(parentUuid)}`;
    console.log('Organization Service - Getting tenants for parent UUID:', parentUuid, 'Endpoint:', endpoint);
    const response = await apiClient.get<Organization[]>(endpoint);
    console.log('Organization Service - Tenants response received:', response);
    return response.data;
  }

  /**
   * Create a new organization under a parent UUID
   * @param organizationData - Organization data
   * @param parentUuid - Parent organization UUID (optional, uses default if not provided)
   * @returns Promise<Organization>
   */
  async createOrganization(organizationData: OrganizationCreateRequest, parentUuid?: string): Promise<Organization> {
    const uuid = parentUuid || API_CONFIG.PARENT_ORG_UUID;
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.CREATE(uuid)}`;
    const response = await apiClient.post<Organization>(endpoint, organizationData);
    return response.data;
  }

  /**
   * Update an existing organization by UUID
   * @param uuid - Organization UUID
   * @param organizationData - Organization data
   * @returns Promise<Organization>
   */
  async updateOrganization(uuid: string, organizationData: OrganizationUpdateRequest): Promise<Organization> {
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.UPDATE(uuid)}`;
    const response = await apiClient.put<Organization>(endpoint, organizationData);
    return response.data;
  }

  /**
   * Delete an organization by UUID (logical delete - sets status to 'D')
   * @param uuid - Organization UUID
   * @returns Promise<Organization>
   */
  async deleteOrganization(uuid: string): Promise<Organization> {
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.DELETE(uuid)}`;
    console.log('Organization Service - Deleting organization by UUID:', uuid, 'Endpoint:', endpoint);
    const response = await apiClient.delete<Organization>(endpoint);
    console.log('Organization Service - Delete response received:', response);
    return response.data;
  }

  /**
   * Bulk delete organizations by list of UUIDs (logical delete - sets status to 'D')
   * @param uuids - Array of organization UUIDs
   * @returns Promise<Organization[]>
   */
  async bulkDeleteOrganizations(uuids: string[]): Promise<Organization[]> {
    const endpoint = `${this.basePath}${API_ENDPOINTS.ORGANIZATIONS.BULK_DELETE()}`;
    console.log('Organization Service - Bulk deleting organizations:', uuids, 'Endpoint:', endpoint);
    const response = await apiClient.delete<Organization[]>(endpoint, uuids);
    console.log('Organization Service - Bulk delete response received:', response);
    return response.data;
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();
export default organizationService;
