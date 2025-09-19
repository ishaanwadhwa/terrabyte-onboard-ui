# API Services

This directory contains the API service layer for the Terrabyte AI application. It provides a clean, type-safe interface for making API calls to the backend services.

## Structure

```
src/services/
├── api/
│   ├── client.ts          # HTTP client for API requests
│   ├── config.ts          # API configuration and endpoints
│   ├── organization.ts    # Organization service
│   ├── types/
│   │   ├── organization.ts # Organization type definitions
│   │   └── index.ts       # Type exports
│   └── index.ts           # API exports
├── hooks/
│   ├── useOrganization.ts # React hook for organization operations
│   └── index.ts           # Hook exports
├── config/
│   └── environment.ts     # Environment configuration
└── index.ts               # Main service exports
```

## Usage

### Basic API Client Usage

```typescript
import { apiClient } from '@/services/api';

// Make a GET request
const response = await apiClient.get<Organization>('/organizations/123');

// Make a POST request
const newOrg = await apiClient.post<Organization>('/organizations', {
  name: 'New Organization',
  description: 'A new organization'
});
```

### Using the Organization Service

```typescript
import { organizationService } from '@/services/api';

// Get organization by UUID
const org = await organizationService.getOrganizationByUuid('55cb6fcf-e902-445d-ba00-e51a3b7c216f');

// Get all organizations
const orgs = await organizationService.getOrganizations();

// Create new organization
const newOrg = await organizationService.createOrganization({
  name: 'New Org',
  description: 'Description',
  orgTypeId: 1,
  addressTypeId: 1
});
```

### Using React Hooks

```typescript
import { useOrganization } from '@/services/hooks';

function OrganizationComponent() {
  const {
    organization,
    organizations,
    loading,
    error,
    getOrganizationByUuid,
    getOrganizations,
    createOrganization
  } = useOrganization();

  useEffect(() => {
    getOrganizations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {organizations.map(org => (
        <div key={org.id}>{org.name}</div>
      ))}
    </div>
  );
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api.terra-byte.ai
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

### API Configuration

The API configuration is centralized in `src/services/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  ORGANIZATION_SERVICE: '/organization-service',
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
} as const;
```

## Available Endpoints

### Organization Service

- `GET /organizations/uuid/{uuid}` - Get organization by UUID
- `GET /organizations/{id}` - Get organization by ID
- `GET /organizations` - Get all organizations (with filters)
- `POST /organizations` - Create new organization
- `PUT /organizations/{id}` - Update organization
- `DELETE /organizations/{id}` - Delete organization
- `PUT /organizations/{id}/status` - Update organization status

## Error Handling

The API client provides consistent error handling:

```typescript
try {
  const org = await organizationService.getOrganizationByUuid(uuid);
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Status:', error.status);
  console.error('Code:', error.code);
}
```

## Type Safety

All API responses are fully typed using TypeScript interfaces:

```typescript
interface Organization {
  id: number;
  name: string;
  description: string;
  orgTypeId: number;
  // ... other fields
}
```

## Example Component

See `src/components/examples/OrganizationExample.tsx` for a complete example of how to use the organization service in a React component.
