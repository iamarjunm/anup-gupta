"use client";

import React, { useState, useEffect } from "react";

const AddressSection = ({ user, updateAddress, deleteAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    country: "India",
    province: "",
    zip: "",
    phone: user?.phone || "",
    isPrimary: false,
  });

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("shopifyAccessToken");
        
        if (!token) {
          console.error("No access token found");
          return;
        }

        const response = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch addresses");
        
        const userData = await response.json();
        if (userData.addresses) {
          setAddresses(userData.addresses);
        }
      } catch (error) {
        console.error("Address fetch error:", error);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form data
  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'address1', 
      'city', 'province', 'zip', 'phone'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError(`Please fill in the ${field} field`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    if (!/^\d{6}$/.test(formData.zip)) {
      setError("ZIP code must be 6 digits");
      return false;
    }

    setError("");
    return true;
  };

  // Save address handler
  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const addressToSave = {
        ...formData,
        phone: `+91 ${formData.phone}`,
        id: editId || `temp-${Date.now()}`,
      };

      let updatedAddresses;
      if (editId) {
        // Update existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editId ? addressToSave : addr
        );
      } else {
        // Add new address
        updatedAddresses = [...addresses, addressToSave];
      }

      // Handle primary address logic
      if (addressToSave.isPrimary) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isPrimary: addr.id === addressToSave.id
        }));
      } else if (updatedAddresses.length === 1) {
        // If this is the only address, make it primary
        updatedAddresses[0].isPrimary = true;
        addressToSave.isPrimary = true;
      }

      setAddresses(updatedAddresses);
      
      // Call update API
      if (updateAddress) {
        await updateAddress(addressToSave);
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Address save error:", error);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete address handler
  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    try {
      await deleteAddress(addressId);
      
      // Remove from local state
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);

      // If we deleted the primary address and there are others left, make the first one primary
      if (updatedAddresses.length > 0 && 
          !updatedAddresses.some(addr => addr.isPrimary)) {
        const newAddresses = [...updatedAddresses];
        newAddresses[0].isPrimary = true;
        setAddresses(newAddresses);
        
        // Update in backend
        if (updateAddress) {
          await updateAddress(newAddresses[0]);
        }
      }
    } catch (error) {
      console.error("Address delete error:", error);
      setError("Failed to delete address. Please try again.");
    }
  };

  // Edit existing address
  const handleEditAddress = (address) => {
    setEditId(address.id);
    setFormData({
      ...address,
      phone: address.phone.replace(/^\+91\s/, "") // Remove country code
    });
    setIsEditing(true);
  };

  // Add new address
  const handleAddNewAddress = () => {
    setEditId(null);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      country: "India",
      province: "",
      zip: "",
      phone: user?.phone || "",
      isPrimary: false,
    });
    setIsEditing(true);
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      country: "India",
      province: "",
      zip: "",
      phone: user?.phone || "",
      isPrimary: false,
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
        ADDRESS BOOK
      </h2>
      
      {loading && (
        <div className="mb-4 text-sm text-charcoal-600">Loading your addresses...</div>
      )}
      
      {error && (
        <div className="mb-4 text-sm text-red-600 border-l-2 border-red-600 pl-3">
          {error}
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-6">
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {[...addresses].sort((a, b) => b.isPrimary - a.isPrimary).map((address) => (
                <div
                  key={address.id}
                  className={`p-6 border ${
                    address.isPrimary 
                      ? "border-charcoal-900" 
                      : "border-ivory-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <p className="font-light text-charcoal-900">
                          {address.firstName} {address.lastName}
                        </p>
                        {address.isPrimary && (
                          <span className="ml-2 text-xs font-medium tracking-wide text-charcoal-600 bg-ivory-100 px-2 py-1">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-charcoal-600 mt-1">
                        {address.company && `${address.company}, `}
                        {address.address1}, {address.address2 && `${address.address2}, `}
                        {address.city}, {address.province}, {address.zip}
                      </p>
                      
                      <p className="text-sm text-charcoal-600 mt-1">
                        {address.country}
                      </p>
                      
                      <p className="text-sm text-charcoal-600 mt-1">
                        Phone: {address.phone}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="text-xs font-medium tracking-wide text-charcoal-500 hover:text-charcoal-900 underline"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs font-medium tracking-wide text-red-600 hover:text-red-900 underline"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-ivory-300 p-6 text-center">
              <p className="text-charcoal-600">No addresses saved yet</p>
            </div>
          )}

          <button
            onClick={handleAddNewAddress}
            className="w-full md:w-auto px-6 py-3 border border-charcoal-900 text-charcoal-900 
                      text-xs font-medium tracking-wide hover:bg-ivory-200 transition-colors"
          >
            + ADD NEW ADDRESS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                FIRST NAME *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                LAST NAME *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
              COMPANY (OPTIONAL)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                        focus:outline-none focus:border-charcoal-500 font-light"
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
              ADDRESS *
            </label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                        focus:outline-none focus:border-charcoal-500 font-light"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
              APARTMENT, SUITE, ETC. (OPTIONAL)
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                        focus:outline-none focus:border-charcoal-500 font-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                CITY *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                STATE *
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                ZIP CODE *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
              PHONE *
            </label>
            <div className="flex">
              <div className="w-1/4">
                <input
                  type="text"
                  value="+91"
                  readOnly
                  className="w-full p-3 border border-ivory-300 bg-ivory-100 
                            text-charcoal-900 font-light"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-3/4 p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                required
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
              COUNTRY *
            </label>
            <input
              type="text"
              name="country"
              value="India"
              readOnly
              className="w-full p-3 border border-ivory-300 bg-ivory-100 
                        text-charcoal-900 font-light"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleInputChange}
              id="primary-address"
              className="h-4 w-4 border-ivory-300 rounded focus:ring-charcoal-500 
                        text-charcoal-900"
            />
            <label htmlFor="primary-address" className="ml-2 text-sm text-charcoal-600">
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-charcoal-900 text-charcoal-900 
                        text-xs font-medium tracking-wide hover:bg-ivory-200 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSaveAddress}
              className="px-6 py-2 bg-charcoal-900 text-black text-xs font-medium 
                        tracking-wide hover:bg-charcoal-800 transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "SAVING..." : "SAVE ADDRESS"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;