'use client';

// src/contexts/CurrencyContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create a Context for the selected currency and conversion rates
export const CurrencyContext = createContext({
  selectedCurrency: 'INR',
  conversionRates: {}, // Rates relative to the base currency
  setSelectedCurrency: () => {},
  loadingRates: true,
  errorRates: null,
});

export const CurrencyProvider = ({ children, baseCurrency = 'INR' }) => {
  // Initialize with a default value (e.g., 'INR') on the server.
  // The actual value from localStorage will be set after mounting.
  const [selectedCurrency, setSelectedCurrency] = useState('INR'); // Removed the stray '{' here
  const [conversionRates, setConversionRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(true);
  const [errorRates, setErrorRates] = useState(null);

  // Effect to load selected currency from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if window (browser environment) is defined
      const storedCurrency = localStorage.getItem('selectedCurrency');
      if (storedCurrency) {
        setSelectedCurrency(storedCurrency);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect to fetch rates when selectedCurrency or baseCurrency changes
  useEffect(() => {
    const fetchRates = async () => {
      setLoadingRates(true);
      setErrorRates(null);

      // On server-side, if selectedCurrency is default, just set rate to 1 for base.
      // This avoids making API calls on the server unnecessarily or incorrectly.
      // Important: Ensure selectedCurrency is properly initialized before checking.
      if (typeof window === 'undefined') {
          // For server-side rendering, provide a default rate of 1 for the base currency.
          // This ensures prices can be rendered even without a client-side API call.
          setConversionRates({ [baseCurrency]: 1 });
          setLoadingRates(false);
          return;
      }

      // If selectedCurrency is same as baseCurrency, no conversion needed
      if (selectedCurrency === baseCurrency) {
        setConversionRates({ [baseCurrency]: 1 });
        setLoadingRates(false);
        return;
      }

      try {
        // Correct API call for a specific base and target symbol
        const response = await fetch(
  `https://api.frankfurter.dev/v1/latest?from=${baseCurrency}&to=${selectedCurrency}`
);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Frankfurter API returns rates object like { "USD": X, "EUR": Y } relative to 'from'
        // We only care about the 'to' currency rate here.
        if (data.rates && typeof data.rates[selectedCurrency] === 'number') {
          // Store the rate for the selected currency.
          // We only need the rate for the selected currency relative to baseCurrency.
          setConversionRates({ [selectedCurrency]: data.rates[selectedCurrency] });
        } else {
          // If no direct rate found for the specific pair, fall back to 1 for base.
          // This can happen if the API doesn't support the direct conversion.
          console.warn(`No direct rate found for ${baseCurrency} to ${selectedCurrency}. Falling back to base currency rate of 1.`);
          setConversionRates({ [baseCurrency]: 1 }); // Fallback
        }
      } catch (e) {
        setErrorRates(e);
        console.error("Failed to fetch conversion rates:", e);
        // On error, set conversion rate for selected currency to 1 (relative to itself)
        // or for the base currency, depending on desired fallback behavior.
        // For robustness, we'll set the selected currency's rate to 1 here,
        // and let formatCurrency handle displaying it in base if the actual selected rate isn't there.
        setConversionRates({ [baseCurrency]: 1 }); // Fallback to base currency rate if conversion fails
      } finally {
        setLoadingRates(false);
      }
    };

    // This condition was potentially problematic. Simpler approach:
    // Always fetch on client-side when dependencies change, but handle server-side gracefully within fetchRates.
    fetchRates();
  }, [selectedCurrency, baseCurrency]); // Depend on both to refetch when either changes

  // Effect to save selected currency to localStorage (only on client-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', selectedCurrency);
    }
  }, [selectedCurrency]);

  const contextValue = {
    selectedCurrency,
    setSelectedCurrency,
    conversionRates,
    loadingRates,
    errorRates,
    baseCurrency, // Expose base currency for external use if needed
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};