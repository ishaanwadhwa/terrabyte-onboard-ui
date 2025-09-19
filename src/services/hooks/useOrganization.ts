/**
 * Organization Hook
 * React hook for organization-related operations
 */

import { useState, useCallback } from 'react';
import { organizationService } from '../api/organization';
import type {
  Organization,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
  OrganizationFilters,
} from '../api/types/organization';
// Define error type for hooks
type ApiError = Error & { status: number; code?: string };

interface UseOrganizationState {
  organization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  error: ApiError | null;
  total: number;
  page: number;
  limit: number;
}

interface UseOrganizationActions {
  getOrganizationByUuid: (uuid: string) => Promise<void>;
  getOrganizationById: (id: number) => Promise<void>;
  getOrganizations: (filters?: OrganizationFilters) => Promise<void>;
  getTenants: (parentUuid: string) => Promise<void>;
  loadOrganizationsFromArray: (organizations: Organization[]) => Promise<void>;
  createOrganization: (data: OrganizationCreateRequest, parentUuid?: string) => Promise<Organization | null>;
  updateOrganization: (uuid: string, data: OrganizationUpdateRequest) => Promise<Organization | null>;
  deleteOrganization: (uuid: string) => Promise<boolean>;
  bulkDeleteOrganizations: (uuids: string[]) => Promise<boolean>;
  updateOrganizationStatus: (uuid: string, status: 'A' | 'I' | 'D') => Promise<Organization | null>;
  clearError: () => void;
  clearOrganization: () => void;
  clearOrganizations: () => void;
}

export function useOrganization(): UseOrganizationState & UseOrganizationActions {
  const [state, setState] = useState<UseOrganizationState>({
    organization: null,
    organizations: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: ApiError | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const getOrganizationByUuid = useCallback(async (uuid: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const organization = await organizationService.getOrganizationByUuid(uuid);
      setState(prev => ({ 
        ...prev, 
        organization,
        // Add the single organization to the organizations array for table display
        organizations: [organization]
      }));
    } catch (error) {
      setError(error as ApiError);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getOrganizationById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const organization = await organizationService.getOrganizationByUuid(id.toString());
      setState(prev => ({ ...prev, organization }));
    } catch (error) {
      setError(error as ApiError);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getOrganizations = useCallback(async (_filters?: OrganizationFilters) => {
    // This method is not implemented in the service yet
    console.warn('getOrganizations method is not implemented yet');
  }, []);

  const getTenants = useCallback(async (parentUuid: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const tenants = await organizationService.getTenants(parentUuid);
      setState(prev => ({
        ...prev,
        organizations: tenants,
        total: tenants.length,
      }));
    } catch (error) {
      setError(error as ApiError);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Function to load multiple organizations from an array
  const loadOrganizationsFromArray = useCallback(async (organizations: Organization[]) => {
    setState(prev => ({
      ...prev,
      organizations: organizations,
      total: organizations.length,
    }));
  }, []);

  const createOrganization = useCallback(async (data: OrganizationCreateRequest, parentUuid?: string): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const organization = await organizationService.createOrganization(data, parentUuid);
      setState(prev => ({ 
        ...prev, 
        organization,
        // Add the new organization to the organizations array
        organizations: [...prev.organizations, organization]
      }));
      return organization;
    } catch (error) {
      setError(error as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateOrganization = useCallback(async (uuid: string, data: OrganizationUpdateRequest): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const organization = await organizationService.updateOrganization(uuid, data);
      setState(prev => ({ 
        ...prev, 
        organization,
        // Update the organization in the organizations array
        organizations: prev.organizations.map(org => 
          org.uuid === uuid ? organization : org
        )
      }));
      return organization;
    } catch (error) {
      setError(error as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteOrganization = useCallback(async (uuid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await organizationService.deleteOrganization(uuid);
      setState(prev => ({
        ...prev,
        organizations: prev.organizations.filter(org => org.uuid !== uuid),
      }));
      return true;
    } catch (error) {
      setError(error as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const bulkDeleteOrganizations = useCallback(async (uuids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await organizationService.bulkDeleteOrganizations(uuids);
      setState(prev => ({
        ...prev,
        organizations: prev.organizations.filter(org => !uuids.includes(org.uuid)),
      }));
      return true;
    } catch (error) {
      setError(error as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateOrganizationStatus = useCallback(async (uuid: string, _status: 'A' | 'I' | 'D'): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // For status update, we'll use the update method with status field
      const organization = await organizationService.updateOrganization(uuid, { 
        name: '', // These will be filled from existing data
        description: '',
        orgTypeId: 1,
        addressTypeId: 1,
        // Add status field if the API supports it
      } as any);
      setState(prev => ({
        ...prev,
        organizations: prev.organizations.map(org => 
          org.uuid === uuid ? organization : org
        ),
        organization: prev.organization?.uuid === uuid ? organization : prev.organization,
      }));
      return organization;
    } catch (error) {
      setError(error as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearOrganization = useCallback(() => {
    setState(prev => ({ ...prev, organization: null }));
  }, []);

  const clearOrganizations = useCallback(() => {
    setState(prev => ({ ...prev, organizations: [], total: 0, page: 1 }));
  }, []);

  return {
    ...state,
    getOrganizationByUuid,
    getOrganizationById,
    getOrganizations,
    getTenants,
    loadOrganizationsFromArray,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    bulkDeleteOrganizations,
    updateOrganizationStatus,
    clearError,
    clearOrganization,
    clearOrganizations,
  };
}
