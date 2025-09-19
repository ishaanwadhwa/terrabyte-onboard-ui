import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Country, State, City } from "country-state-city";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Radio from "../../components/form/input/Radio";
import Select from "../../components/form/Select";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import Button from "../../components/ui/button/Button";
import { useOrganization } from "../../services/hooks/useOrganization";
import type { OrganizationUpdateRequest } from "../../services/api/types/organization";

// Helper function to map API Organization to form data
const mapOrganizationToFormData = (org: any) => ({
  name: org.name || "",
  email: org.emailId || "",
  domain: org.website || "",
  description: org.description || "",
  maxConcurrentUsers: org.maxConcurrentUser || 0,
  status: org.status === 'A' ? 'Active' : 'Inactive' as "Active" | "Inactive",
  address: org.street || "",
  country: org.countryId?.toString() || "",
  state: org.stateId?.toString() || "",
  city: org.city || "",
  pinCode: org.zipCode || "",
  primaryPhone: org.phoneNumberPrimary || "",
  secondaryPhone: org.phoneNumberSecondary || ""
});

export default function EditOrganisation() {
  const { id: uuid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
    description: "",
    maxConcurrentUsers: 0,
    status: "Active" as "Active" | "Inactive",
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    primaryPhone: "",
    secondaryPhone: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  // Use the organization hook
  const {
    organization,
    loading,
    error,
    getOrganizationByUuid,
    updateOrganization,
    clearError,
  } = useOrganization();

  // Load organisation data on mount
  useEffect(() => {
    if (uuid) {
      getOrganizationByUuid(uuid);
    }
  }, [uuid, getOrganizationByUuid]);

  // Update form data when organization is loaded
  useEffect(() => {
    if (organization) {
      const mappedData = mapOrganizationToFormData(organization);
      setFormData(mappedData);
      setSelectedCountry(mappedData.country);
      setSelectedState(mappedData.state);
      setSelectedCity(mappedData.city);
    }
  }, [organization]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (formData.maxConcurrentUsers <= 0) {
      errors.maxConcurrentUsers = "Maximum concurrent users must be greater than 0";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uuid) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const organizationData: OrganizationUpdateRequest = {
        name: formData.name,
        description: formData.description,
        orgTypeId: 1, // Default organization type
        orgRefId: organization?.orgRefId, // preserve existing reference; omit if undefined
        addressTypeId: 1, // Default address type
        emailId: formData.email || null,
        website: formData.domain || null,
        maxConcurrentUser: formData.maxConcurrentUsers || null,
        street: formData.address || null,
        city: selectedCity || null,
        countryId: selectedCountry ? parseInt(selectedCountry) : null,
        stateId: selectedState ? parseInt(selectedState) : null,
        zipCode: formData.pinCode || null,
        phoneNumberPrimary: formData.primaryPhone || null,
        phoneNumberSecondary: formData.secondaryPhone || null,
        status: formData.status === 'Active' ? 'A' : 'I', // Convert form status to API status
        createdBy: 1, // TODO: Replace with current user ID
        updatedBy: 1, // TODO: Replace with current user ID
      };

      const updatedOrganization = await updateOrganization(uuid, organizationData);
      
      if (updatedOrganization) {
        // Navigate back to manage page on success
        navigate("/organisation/manage");
      }
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Show loading state
  if (loading && !organization) {
    return (
      <div className="p-6">
        <PageBreadCrumb
          pageTitle="Edit Organisation"
          parents={[{ label: "Manage Organisation", to: "/organisation/manage" }]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading organization...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageBreadCrumb
        pageTitle="Edit Organisation"
        parents={[{ label: "Manage Organisation", to: "/organisation/manage" }]}
      />
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
      
      <div className="mt-6">
        <Form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Details */}
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Basic Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label> Name *</Label>
                <Input 
                  name="name" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={validationErrors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <TextArea 
                  rows={4} 
                  placeholder="Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={validationErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <Label>Maximum No. of Concurrent Users</Label>
                <Input 
                  type="number" 
                  name="maxConcurrentUsers" 
                  placeholder="0"
                  min="0"
                  value={formData.maxConcurrentUsers}
                  onChange={(e) => handleInputChange("maxConcurrentUsers", parseInt(e.target.value) || 0)}
                  className={validationErrors.maxConcurrentUsers ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
                />
                {validationErrors.maxConcurrentUsers && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.maxConcurrentUsers}</p>
                )}
              </div>
              <div>
                <Label>Domain *</Label>
                <Input 
                  name="domain" 
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-6 h-11">
                  <Radio
                    name="status"
                    id="status-active"
                    label="Active"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={() => handleInputChange("status", "Active")}
                  />
                  <Radio
                    name="status"
                    id="status-inactive"
                    label="Inactive"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={() => handleInputChange("status", "Inactive")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Communication Details */}
          <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Communication Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Address</Label>
                <Input 
                  name="address" 
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Country</Label>
                <Select
                  options={countries.map((c) => ({ value: c.isoCode, label: c.name }))}
                  placeholder="-Select-"
                  onChange={(value) => {
                    setSelectedCountry(value);
                    setSelectedState("");
                    setSelectedCity("");
                    handleInputChange("country", value);
                  }}
                  defaultValue={selectedCountry}
                />
              </div>
              <div>
                <Label>State</Label>
                <Select
                  options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
                  placeholder="-Select-"
                  onChange={(value) => {
                    setSelectedState(value);
                    setSelectedCity("");
                    handleInputChange("state", value);
                  }}
                  defaultValue={selectedState}
                />
              </div>
              <div>
                <Label>City</Label>
                <Select
                  options={cities.map((c) => ({ value: c.name, label: c.name }))}
                  placeholder="-Select-"
                  onChange={(value) => {
                    setSelectedCity(value);
                    handleInputChange("city", value);
                  }}
                  defaultValue={selectedCity}
                />
              </div>
              <div>
                <Label>Pin/Zip Code</Label>
                <Input 
                  name="pinCode" 
                  placeholder="Enter pin/zip code"
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange("pinCode", e.target.value)}
                />
              </div>
              <div>
                <Label>Primary Phone No.</Label>
                <PhoneInput />
              </div>
              <div>
                <Label>Secondary Mobile No.</Label>
                <Input 
                  name="secondaryPhone" 
                  placeholder=""
                  value={formData.secondaryPhone}
                  onChange={(e) => handleInputChange("secondaryPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => navigate("/organisation/manage")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              disabled={loading}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
