'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // For the dropdown arrow
import { motion, AnimatePresence } from 'framer-motion';
import countries from '@/data/countries'; // Adjust the path if necessary

const PhoneInput = ({ 
  onSubmit,
  onCancel,
  initialPhone = '',
  initialCountryCode = '+91' // Ensure this matches a code in countries.js
}) => {
  const defaultCountry = countries.find(c => c.phone === initialCountryCode) || countries.find(c => c.code === 'IN') || countries[0];

  const [phoneData, setPhoneData] = useState(() => {
    // Initialize based on initialPhone and initialCountryCode
    const parsedPhone = initialPhone.startsWith(initialCountryCode) 
      ? initialPhone.substring(initialCountryCode.length)
      : initialPhone;
    return {
      countryCode: defaultCountry.phone,
      phone: parsedPhone
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Ref for the search input
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  // Effect to close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm(''); // Clear search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isCountryDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCountryDropdownOpen]);

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // Allow only numbers
      setPhoneData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleCountrySelect = (country) => {
    setPhoneData(prev => ({ ...prev, countryCode: country.phone }));
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm(''); // Clear search after selection
  };

  const handleCountrySearchChange = (e) => {
    setCountrySearchTerm(e.target.value);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.phone.includes(countrySearchTerm) ||
    country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        countryCode: phoneData.countryCode,
        phone: phoneData.phone
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find the currently selected country name for display
  const currentCountry = countries.find(c => c.phone === phoneData.countryCode);
  const displayCountryName = currentCountry ? `${currentCountry.phone} (${currentCountry.name})` : phoneData.countryCode;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Country Code Dropdown */}
        <div className="col-span-12 md:col-span-3 relative" ref={countryDropdownRef}>
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            COUNTRY CODE
          </label>
          <button
            type="button"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className="w-full h-12 px-3 border border-ivory-300 bg-white text-charcoal-900 
                       font-light flex items-center justify-between cursor-pointer focus:outline-none 
                       focus:border-charcoal-500"
            aria-haspopup="listbox"
            aria-expanded={isCountryDropdownOpen}
          >
            <span className="truncate">{displayCountryName}</span>
            <FiChevronDown size={18} className={`transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isCountryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
                className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-md py-1 z-50
                           border border-gray-100 overflow-hidden
                           max-h-60 overflow-y-auto custom-scrollbar" // max-h-60 for scrollbar
                role="listbox"
              >
                {/* Search Input for Countries */}
                <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search country..."
                    className="w-full px-3 py-2 border border-ivory-300 rounded-md focus:outline-none focus:border-charcoal-500 text-sm"
                    value={countrySearchTerm}
                    onChange={handleCountrySearchChange}
                  />
                </div>

                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <motion.button
                      key={country.code}
                      type="button"
                      className={`block w-full text-left px-4 py-2 text-sm
                                  ${phoneData.countryCode === country.phone ? 'bg-gray-100 text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                                  transition-colors duration-150 ease-in-out`}
                      onClick={() => handleCountrySelect(country)}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      role="option"
                      aria-selected={phoneData.countryCode === country.phone}
                    >
                      {country.phone} ({country.name})
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No countries found.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <div className="col-span-12 md:col-span-9">
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            value={phoneData.phone}
            onChange={handlePhoneChange}
            className="w-full h-12 px-3 border border-ivory-300 bg-white text-charcoal-900 
                       focus:outline-none focus:border-charcoal-500 font-light"
            placeholder="Enter phone number" // Generic placeholder
            required
            // Removed pattern, maxLength, title for flexibility across countries
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-charcoal-900 text-black text-xs font-medium tracking-wide 
                     hover:bg-charcoal-800 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-charcoal-900 text-charcoal-900 text-xs 
                     font-medium tracking-wide hover:bg-ivory-200 transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default PhoneInput;