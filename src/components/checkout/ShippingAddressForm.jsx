"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiX } from "react-icons/fi";
import Link from "next/link";

const ShippingAddressForm = ({ user, onSubmit, initialAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("shopifyAccessToken");
        
        if (!token && user) {
          setError("Please sign in to manage addresses");
          setLoaded(true);
          return;
        }

        if (token) {
          const response = await fetch("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to fetch addresses");
          
          const userData = await response.json();
          if (userData.addresses) {
            setAddresses(userData.addresses);
            
            const addressToSelect = initialAddress || 
                                 userData.addresses.find(addr => addr.isPrimary) || 
                                 userData.addresses[0];
            if (addressToSelect) {
              setSelectedAddress(addressToSelect);
              onSubmit(addressToSelect);
            }
          }
        }
      } catch (error) {
        console.error("Address fetch error:", error);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onSubmit(address);
  };

  return (
    <div className="border border-ivory-300 bg-white p-6">
      <h2 className="text-xl font-serif font-light tracking-wide text-charcoal-900 mb-6 flex items-center border-b border-ivory-300 pb-3">
        <FiMapPin className="mr-2 text-charcoal-600" />
        SHIPPING ADDRESS
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm flex items-center">
          <FiX className="mr-2" />
          {error}
        </div>
      )}

      {loading && !loaded && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-charcoal-900"></div>
        </div>
      )}

      {user && loaded && (
        <>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileHover={{ y: -2 }}
                  className={`p-5 border ${
                    selectedAddress?.id === address.id 
                      ? "border-charcoal-900" 
                      : "border-ivory-300 hover:border-charcoal-500"
                  } transition-colors`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start mb-2">
                        <p className="font-light text-charcoal-900">
                          {address.firstName} {address.lastName}
                        </p>
                        {address.isPrimary && (
                          <span className="ml-2 text-xs font-medium tracking-wide text-charcoal-600 bg-ivory-100 px-2 py-1">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-charcoal-600">
                        {address.company && `${address.company}, `}
                        {address.address1}, {address.address2 && `${address.address2}, `}
                        {address.city}, {address.province}, {address.zip}
                      </p>
                      <p className="text-sm text-charcoal-600 mt-1">
                        {address.country} • Phone: {address.phone}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleSelectAddress(address)}
                        className={`px-4 py-2 text-xs font-medium tracking-wide ${
                          selectedAddress?.id === address.id
                            ? "bg-charcoal-900 text-white"
                            : "border border-charcoal-900 text-charcoal-900 hover:bg-ivory-200"
                        } transition-colors`}
                      >
                        {selectedAddress?.id === address.id ? "SELECTED" : "SELECT"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-ivory-300">
              <p className="mb-4 text-charcoal-600">No saved addresses found.</p>
              <Link 
                href="/account" 
                className="px-6 py-3 bg-charcoal-900 text-white text-xs font-medium tracking-wide 
                          hover:bg-charcoal-800 transition-colors inline-block"
              >
                ADD ADDRESS IN ACCOUNT
              </Link>
            </div>
          )}
        </>
      )}

      {!user && loaded && (
        <div className="text-center py-6 border border-ivory-300">
          <p className="mb-4 text-charcoal-600">Please sign in to select an address.</p>
          <Link 
            href="/account/login" 
            className="px-6 py-3 border border-charcoal-900 text-charcoal-900 text-xs 
                      font-medium tracking-wide hover:bg-ivory-200 transition-colors inline-block"
          >
            SIGN IN
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressForm;