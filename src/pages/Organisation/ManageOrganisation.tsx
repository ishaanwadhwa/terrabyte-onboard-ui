import { useState, useEffect } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import ComponentCard from "../../components/common/ComponentCard";
import Checkbox from "../../components/form/input/Checkbox";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { BoxIcon, PencilIcon, TrashBinIcon, PlusIcon } from "../../icons";
import { useNavigate } from "react-router";
import { useOrganization } from "../../services/hooks/useOrganization";
import type { Organization } from "../../services/api/types/organization";

// Helper function to map API Organization to display format
const mapOrganizationToDisplay = (org: Organization) => ({
  id: org.id,
  uuid: org.uuid,
  name: org.name,
  email: org.emailId || 'N/A',
  domain: org.website || 'N/A',
  maxUsers: org.maxConcurrentUser || 0,
  registeredUsers: org.numberOfUser || 0,
  status: org.status === 'A' ? 'Active' : org.status === 'I' ? 'Inactive' : 'Pending' as "Active" | "Inactive" | "Pending",
});

export default function ManageOrganization() {
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20, 50];
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  // Use the organization hook
  const {
    organizations: apiOrganizations,
    loading,
    error,
    getTenants,
    deleteOrganization,
    bulkDeleteOrganizations,
    clearError,
  } = useOrganization();

  // Map API organizations to display format
  const organisations = apiOrganizations.map(mapOrganizationToDisplay);

  // Pagination calculations
  const filteredOrganisations = organisations.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      o.name.toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q)
    );
  });
  const totalItems = filteredOrganisations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrganisations = filteredOrganisations.slice(startIndex, endIndex);

  const allUuids = paginatedOrganisations.map((o) => o.uuid);
  const allSelected = selectedUuids.length > 0 && selectedUuids.length === allUuids.length;

  const toggleAll = (checked: boolean) => {
    setSelectedUuids(checked ? allUuids : []);
  };

  const toggleOne = (uuid: string, checked: boolean) => {
    setSelectedUuids((prev) => (checked ? [...new Set([...prev, uuid])] : prev.filter((x) => x !== uuid)));
  };

  const isSingleSelected = selectedUuids.length === 1;
  const isAnySelected = selectedUuids.length > 0;

  // Load organizations on component mount
  useEffect(() => {
    // Load all tenant organizations (child orgs) for the parent organization
    loadTenantOrganizations();
  }, []);

  // Load tenant organizations to display in table
  const loadTenantOrganizations = () => {
    console.log('Loading tenant organizations...');
    
    getTenants('55cb6fcf-e902-445d-ba00-e51a3b7c216f')
      .then(() => {
        console.log('Tenant organizations loaded successfully');
      })
      .catch((error) => {
        console.error('Error loading tenant organizations:', error);
      });
  };

  // Delete organizations using API
  const deleteOrganisations = async (uuids: string[]) => {
    try {
      if (uuids.length === 1) {
        // Single delete
        await deleteOrganization(uuids[0]);
      } else {
        // Bulk delete
        await bulkDeleteOrganizations(uuids);
      }
      setSelectedUuids([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting organizations:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteOrganisations(selectedUuids);
  };

  const getSelectedOrganizationNames = () => {
    return selectedUuids.map(uuid => {
      const org = organisations.find(o => o.uuid === uuid);
      return org?.name || `Organization ${uuid}`;
    });
  };
  // Show loading state
  if (loading && organisations.length === 0) {
    return (
      <div className="p-6">
        <PageBreadCrumb pageTitle="Manage Organisation" />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading tenant organizations...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
    <div className="pb-4">
        <PageBreadCrumb pageTitle="Manage Tenant Organizations" />
    </div>
    
    {/* Error Display */}
    {error && (
      <div className="mx-6 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
    <div className="px-6">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Button
          size="sm"
          variant="primary"
          startIcon={
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          onClick={() => navigate("/organization/manage/add")}
          className="flex-shrink-0"
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<PencilIcon className="size-5" />}
          disabled={!isSingleSelected}
          onClick={() => {
            if (isSingleSelected) {
              navigate(`/organization/manage/edit/${selectedUuids[0]}`);
            }
          }}
          className="flex-shrink-0"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<TrashBinIcon className="size-5" />}
          disabled={!isAnySelected}
          onClick={handleDeleteClick}
          className="flex-shrink-0"
        >
          Delete
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<BoxIcon className="size-5" />}
          disabled={!isSingleSelected}
          className="flex-shrink-0"
        >
          Assign Menus
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<BoxIcon className="size-5" />}
          disabled={!isSingleSelected}
          className="flex-shrink-0"
        >
          Manage Links
        </Button>
      </div>
    </div>
      <div className="mt-6">
        <ComponentCard 
          title="Tenant Organizations List"
          actions={
            <>
              <div className="relative w-full sm:w-auto">
                <span className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search name or email"
                  className="h-10 w-full sm:w-[280px] rounded-lg border border-gray-200 bg-transparent pl-10 pr-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-border dark:bg-background dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </>
          }
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start">
                      <Checkbox checked={allSelected} onChange={toggleAll} />
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Name</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Email</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Domain</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Maximum Users</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Registered Users</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">Status</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-white">UUID</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedOrganisations.map((org) => (
                    <TableRow key={org.uuid}>
                      <TableCell className="px-5 py-4 text-start">
                        <Checkbox
                          checked={selectedUuids.includes(org.uuid)}
                          onChange={(checked) => toggleOne(org.uuid, checked)}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white">{org.name}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white">{org.email}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white">{org.domain}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white">{org.maxUsers}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white">{org.registeredUsers}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge
                          size="sm"
                          color={
                            org.status === "Active"
                              ? "success"
                              : org.status === "Pending"
                              ? "warning"
                              : "error"
                          }
                        >
                          {org.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white font-mono text-xs">{org.uuid}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 mr-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Items per page</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                    >
                      {pageSizeOptions.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-border dark:bg-background dark:text-foreground"
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.backgroundColor = 'hsl(182 96% 23%)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = 'hsl(182 96% 23%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.05]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-border dark:bg-background dark:text-foreground"
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.backgroundColor = 'hsl(182 96% 23%)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = 'hsl(182 96% 23%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrashBinIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Tenant Organization{selectedUuids.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Are you sure you want to delete the following tenant organization{selectedUuids.length > 1 ? 's' : ''}?
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {getSelectedOrganizationNames().map((name, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


