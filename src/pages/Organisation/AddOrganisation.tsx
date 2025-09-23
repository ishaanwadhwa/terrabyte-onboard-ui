import { useState } from "react";
import { useNavigate } from "react-router";
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
import type { OrganizationCreateRequest } from "../../services/api/types/organization";

export default function AddOrganization() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    domain: "",
    maxConcurrentUsers: 0,
    address: "",
    pinCode: "",
    mobileNumber: "",
    phoneNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  // Use the organization hook
  const {
    loading,
    error,
    createOrganization,
    clearError,
  } = useOrganization();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Domain validation
    if (!formData.domain.trim()) {
      errors.domain = "Domain is required";
    }

    // Max concurrent users validation
    if (formData.maxConcurrentUsers <= 0) {
      errors.maxConcurrentUsers = "Maximum concurrent users must be greater than 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      const organizationData: OrganizationCreateRequest = {
        name: formData.name,
        description: formData.description,
        orgTypeId: 1, // Default organization type
        addressTypeId: 1, // Default address type
        emailId: formData.email || undefined,
        website: formData.domain || undefined,
        maxConcurrentUser: formData.maxConcurrentUsers || undefined,
        street: formData.address || undefined,
        city: selectedCity || undefined,
        countryId: selectedCountry ? parseInt(selectedCountry) : undefined,
        stateId: selectedState ? parseInt(selectedState) : undefined,
        zipCode: formData.pinCode || undefined,
        mobileNumberPrimary: formData.mobileNumber || undefined,
        phoneNumberPrimary: formData.phoneNumber || undefined,
        status: status === 'Active' ? 'A' : 'I', // Convert form status to API status
      };

      const newOrganization = await createOrganization(organizationData);
      
      if (newOrganization) {
        // Navigate back to manage page on success
        navigate("/organization/manage");
      }
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const onReset = () => {
    setFormData({
      name: "",
      description: "",
      email: "",
      domain: "",
      maxConcurrentUsers: 0,
      address: "",
      pinCode: "",
      mobileNumber: "",
      phoneNumber: "",
    });
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setStatus("Active");
    setValidationErrors({});
  };

  return (
    <div className="p-6">
      <PageBreadCrumb
        pageTitle="Add Organization"
        parents={[{ label: "Manage Organization", to: "/organisation/manage" }]}
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
                <Label>Maximum No. of Concurrent Users *</Label>
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
                  className={validationErrors.domain ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
                />
                {validationErrors.domain && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.domain}</p>
                )}
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-6 h-11">
                  <Radio
                    name="status"
                    id="status-active"
                    label="Active"
                    value="Active"
                    checked={status === "Active"}
                    onChange={() => setStatus("Active")}
                  />
                  <Radio
                    name="status"
                    id="status-inactive"
                    label="Inactive"
                    value="Inactive"
                    checked={status === "Inactive"}
                    onChange={() => setStatus("Inactive")}
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
                  }}
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
                  }}
                  defaultValue={selectedState}
                />
              </div>
              <div>
                <Label>City</Label>
                <Select
                  options={cities.map((c) => ({ value: c.name, label: c.name }))}
                  placeholder="-Select-"
                  onChange={(value) => setSelectedCity(value)}
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
                <Label>Mobile Number</Label>
                <PhoneInput 
                  value={formData.mobileNumber}
                  onChange={(value) => handleInputChange("mobileNumber", value)}
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <PhoneInput 
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => navigate("/organization/manage")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              type="button"
              disabled={loading}
              onClick={onReset}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}


