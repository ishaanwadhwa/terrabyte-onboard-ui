/**
 * Organization Types
 * TypeScript interfaces for organization-related API responses
 */

export interface Organization {
  id: number;
  name: string;
  description: string;
  orgTypeId: number;
  orgRefId: number;
  phoneNumberPrimary: string | null;
  phoneNumberSecondary: string | null;
  faxNumber: string | null;
  mobileNumberPrimary: string | null;
  mobileNumberSecondary: string | null;
  emailId: string | null;
  website: string | null;
  numberOfUser: number | null;
  maxConcurrentUser: number | null;
  addressTypeId: number;
  street: string | null;
  city: string | null;
  countryId: number | null;
  stateId: number | null;
  stateOther: string | null;
  zipCode: string | null;
  status: 'A' | 'I' | 'D'; // Active, Inactive, Deleted
  createdBy: number;
  updatedBy: number | null;
  createdOn: number; // Unix timestamp
  updatedOn: number | null; // Unix timestamp
  uuid: string;
}

export interface OrganizationCreateRequest {
  name: string;
  description: string;
  orgTypeId: number;
  orgRefId?: number; // Organization reference ID
  phoneNumberPrimary?: string | null;
  phoneNumberSecondary?: string | null;
  faxNumber?: string | null;
  mobileNumberPrimary?: string | null;
  mobileNumberSecondary?: string | null;
  emailId?: string | null;
  website?: string | null;
  numberOfUser?: number | null;
  maxConcurrentUser?: number | null;
  addressTypeId: number;
  street?: string | null;
  city?: string | null;
  countryId?: number | null;
  stateId?: number | null;
  stateOther?: string | null;
  zipCode?: string | null;
  status?: 'A' | 'I' | 'D'; // Active, Inactive, Deleted
  createdBy?: number; // User ID who created the organization
  updatedBy?: number; // User ID who last updated the organization
}

export interface OrganizationUpdateRequest {
  name: string;
  description: string;
  orgTypeId: number;
  orgRefId?: number; // Organization reference ID
  phoneNumberPrimary?: string | null;
  phoneNumberSecondary?: string | null;
  faxNumber?: string | null;
  mobileNumberPrimary?: string | null;
  mobileNumberSecondary?: string | null;
  emailId?: string | null;
  website?: string | null;
  numberOfUser?: number | null;
  maxConcurrentUser?: number | null;
  addressTypeId: number;
  street?: string | null;
  city?: string | null;
  countryId?: number | null;
  stateId?: number | null;
  stateOther?: string | null;
  zipCode?: string | null;
  status?: 'A' | 'I' | 'D'; // Active, Inactive, Deleted
  createdBy?: number; // User ID who created the organization
  updatedBy?: number; // User ID who last updated the organization
}

export interface OrganizationListResponse {
  organizations: Organization[];
  total: number;
  page: number;
  limit: number;
}

export interface OrganizationFilters {
  status?: 'A' | 'I' | 'D';
  orgTypeId?: number;
  countryId?: number;
  stateId?: number;
  search?: string;
  page?: number;
  limit?: number;
}
