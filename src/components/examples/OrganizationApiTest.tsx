/**
 * Organization API Test Component
 * Simple component to test the organization API integration
 */

import React, { useState } from 'react';
import { useOrganization } from '../../services/hooks/useOrganization';
import Button from '../ui/button/Button';

const OrganizationApiTest: React.FC = () => {
  const [testUuid, setTestUuid] = useState('55cb6fcf-e902-445d-ba00-e51a3b7c216f');
  const [result, setResult] = useState<string>('');
  
  const {
    organization,
    loading,
    error,
    getOrganizationByUuid,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    clearError,
  } = useOrganization();

  const handleGetOrganization = async () => {
    setResult('Loading...');
    try {
      await getOrganizationByUuid(testUuid);
      setResult('Organization loaded successfully!');
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateOrganization = async () => {
    setResult('Creating...');
    try {
      const newOrg = await createOrganization({
        name: 'Test Organization',
        description: 'Created via API test',
        orgTypeId: 1,
        addressTypeId: 1,
        emailId: 'test@example.com',
        website: 'test.com',
        maxConcurrentUser: 100,
      });
      setResult(`Organization created with ID: ${newOrg?.id}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateOrganization = async () => {
    if (!organization) {
      setResult('No organization loaded to update');
      return;
    }
    
    setResult('Updating...');
    try {
      const updatedOrg = await updateOrganization(organization.uuid, {
        name: 'Updated Organization',
        description: 'Updated via API test',
        orgTypeId: 1,
        addressTypeId: 1,
        emailId: 'updated@example.com',
        website: 'updated.com',
        maxConcurrentUser: 200,
      });
      setResult(`Organization updated successfully!`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!organization) {
      setResult('No organization loaded to delete');
      return;
    }
    
    setResult('Deleting...');
    try {
      await deleteOrganization(organization.uuid);
      setResult('Organization deleted successfully!');
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Organization API Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>Error: {error.message}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test UUID
          </label>
          <input
            type="text"
            value={testUuid}
            onChange={(e) => setTestUuid(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter organization UUID"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGetOrganization}
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Loading...' : 'Get Organization'}
          </Button>
          
          <Button
            onClick={handleCreateOrganization}
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Creating...' : 'Create Organization'}
          </Button>
          
          <Button
            onClick={handleUpdateOrganization}
            disabled={loading || !organization}
            variant="primary"
          >
            {loading ? 'Updating...' : 'Update Organization'}
          </Button>
          
          <Button
            onClick={handleDeleteOrganization}
            disabled={loading || !organization}
            variant="primary"
          >
            {loading ? 'Deleting...' : 'Delete Organization'}
          </Button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-6">
          <h3 className="font-medium mb-2">Result:</h3>
          <p className="text-sm">{result}</p>
        </div>
      )}

      {organization && (
        <div className="bg-white border border-gray-300 rounded-md p-4">
          <h3 className="font-medium mb-2">Current Organization:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> {organization.id}</div>
            <div><strong>Name:</strong> {organization.name}</div>
            <div><strong>Description:</strong> {organization.description}</div>
            <div><strong>Status:</strong> {organization.status}</div>
            <div><strong>Email:</strong> {organization.emailId || 'N/A'}</div>
            <div><strong>Website:</strong> {organization.website || 'N/A'}</div>
            <div><strong>Max Users:</strong> {organization.maxConcurrentUser || 'N/A'}</div>
            <div><strong>UUID:</strong> {organization.uuid}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationApiTest;
