/**
 * Organization Example Component
 * Example component demonstrating how to use the organization service
 */

import React, { useEffect, useState } from 'react';
import { useOrganization } from '../../services/hooks/useOrganization';

const OrganizationExample: React.FC = () => {
  const {
    organization,
    organizations,
    loading,
    error,
    getOrganizationByUuid,
    getOrganizations,
    clearError,
  } = useOrganization();

  const [uuid, setUuid] = useState('55cb6fcf-e902-445d-ba00-e51a3b7c216f');

  const handleGetByUuid = async () => {
    if (uuid.trim()) {
      await getOrganizationByUuid(uuid.trim());
    }
  };

  const handleGetAll = async () => {
    await getOrganizations();
  };

  useEffect(() => {
    // Load organizations on component mount
    handleGetAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Organization API Example</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Get Organization by UUID */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Get Organization by UUID</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization UUID
              </label>
              <input
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organization UUID"
              />
            </div>
            <button
              onClick={handleGetByUuid}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Organization
            </button>
          </div>
        </div>

        {/* Get All Organizations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Get All Organizations</h2>
          <button
            onClick={handleGetAll}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Load Organizations
          </button>
        </div>
      </div>

      {/* Display Results */}
      <div className="mt-8 space-y-6">
        {/* Single Organization */}
        {organization && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">ID:</span> {organization.id}
              </div>
              <div>
                <span className="font-medium">Name:</span> {organization.name}
              </div>
              <div>
                <span className="font-medium">Description:</span> {organization.description}
              </div>
              <div>
                <span className="font-medium">Status:</span> {organization.status}
              </div>
              <div>
                <span className="font-medium">UUID:</span> {organization.uuid}
              </div>
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(organization.createdOn).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Organizations List */}
        {organizations.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Organizations List ({organizations.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.id} className="border-t">
                      <td className="px-4 py-2">{org.id}</td>
                      <td className="px-4 py-2">{org.name}</td>
                      <td className="px-4 py-2">{org.description}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            org.status === 'A'
                              ? 'bg-green-100 text-green-800'
                              : org.status === 'I'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(org.createdOn).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationExample;
