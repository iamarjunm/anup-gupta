'use client';
// src/components/CurrencySwitcher.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { CurrencyContext } from '@/context/CurrencyContext';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CurrencySwitcher = ({ textColorClass }) => {
  const [currencies, setCurrencies] = useState({});
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [errorCurrencies, setErrorCurrencies] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { selectedCurrency, setSelectedCurrency, loadingRates, errorRates } = useContext(CurrencyContext);

  // Fetch and sort currencies
  useEffect(() => {
    const fetchCurrenciesList = async () => {
      try {
        const response = await fetch('https://api.frankfurter.dev/v1/currencies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedCurrencies = Object.fromEntries(
          Object.entries(data).sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
        );
        setCurrencies(sortedCurrencies);
      } catch (e) {
        setErrorCurrencies(e);
        console.error("Failed to fetch currencies list:", e);
      } finally {
        setLoadingCurrencies(false);
      }
    };
    fetchCurrenciesList();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (code) => {
    setSelectedCurrency(code);
    setIsOpen(false);
  };

  if (loadingCurrencies) {
    return <div className={`text-sm ${textColorClass}`}>Loading...</div>;
  }

  if (errorCurrencies) {
    return <div className={`text-sm text-red-500 ${textColorClass}`}>Error</div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Currency Display Button */}
      <motion.button
        type="button"
        // Increased padding for more visual space
        className={`flex items-center gap-1 text-base font-medium uppercase tracking-wider
                    hover:opacity-80 transition-opacity focus:outline-none ${textColorClass}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedCurrency}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={18} />
        </motion.span>
      </motion.button>

      {/* Currency Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }} // Added scale for subtle "pop" effect
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }} // Refined transition
            // Increased width, rounded-lg for softer corners, subtle border, lighter shadow
            className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg py-1 z-50
                       border border-gray-100 overflow-hidden
                       max-h-80 overflow-y-auto custom-scrollbar" // Increased max-height
            role="listbox"
          >
            {Object.entries(currencies).map(([code, name]) => (
              <motion.button
                key={code}
                type="button"
                // Increased padding for more touch target, slightly darker hover background
                className={`block w-full text-left px-4 py-2 text-sm font-normal whitespace-nowrap
                            ${selectedCurrency === code ? 'bg-gray-100 text-black font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                            transition-colors duration-150 ease-in-out`} // Added ease-in-out
                onClick={() => handleCurrencySelect(code)}
                whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.03)' }} // More pronounced hover slide, very subtle background
                transition={{ type: 'spring', stiffness: 400, damping: 20 }} // Softer spring for hover
                role="option"
                aria-selected={selectedCurrency === code}
              >
                {code} - {name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading/Error indicators */}
      {(loadingRates || errorRates) && (
        <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs w-full text-center
                          ${errorRates ? 'text-red-500' : (textColorClass === 'text-white' ? 'text-gray-300' : 'text-gray-500')}`}>
          {loadingRates ? 'Updating...' : 'Rate Error!'}
        </span>
      )}
    </div>
  );
};

export default CurrencySwitcher;