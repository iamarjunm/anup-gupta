// src/utils/formatCurrency.js
import { useContext } from 'react';
import { CurrencyContext } from '@/context/CurrencyContext';

const formatCurrency = (amount) => {
  const { selectedCurrency, conversionRates, baseCurrency, loadingRates, errorRates } = useContext(CurrencyContext);

  // Handle loading and error states first
  if (loadingRates) {
    return 'Loading...'; // Or a skeleton loader
  }
  if (errorRates) {
    console.error("Error fetching conversion rates. Displaying in base currency.");
    // Fallback to base currency formatting on API error
    return new Intl.NumberFormat('en-IN', { // 'en-IN' as a general fallback locale
      style: "currency",
      currency: baseCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    console.error("Invalid amount provided to formatCurrency:", amount);
    return new Intl.NumberFormat('en-IN', { // 'en-IN' as a general fallback locale
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0); // Display 0 in selected currency for invalid input
  }

  let finalAmount = numericAmount;
  let displayCurrency = selectedCurrency;

  // Determine the rate to use for conversion
  let rateToUse = conversionRates[selectedCurrency];

  // If the selectedCurrency is the baseCurrency, the rate should implicitly be 1
  if (selectedCurrency === baseCurrency) {
      rateToUse = 1;
  }

  // If the rate for the selected currency is not directly found in conversionRates,
  // it means our `CurrencyContext` might have fallen back to only providing
  // the base currency's rate (e.g., if the direct conversion failed).
  // In this case, we should display the original amount in the base currency.
  if (typeof rateToUse !== 'number' || rateToUse <= 0) {
    console.warn(`No valid conversion rate found for ${selectedCurrency}. Displaying value in base currency (${baseCurrency}).`);
    displayCurrency = baseCurrency;
    rateToUse = 1; // Ensure rate is 1 if we're falling back to base
  }

  // Apply conversion if necessary
  finalAmount = numericAmount * rateToUse;

  // Use a generic locale like 'en-US' or 'en-IN' and rely on Intl.NumberFormat
  // to correctly display the currency symbol and format based on the 'currency' option.
  return new Intl.NumberFormat('en-US', { // Changed to 'en-US' as a widely compatible default
    style: "currency",
    currency: displayCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalAmount);
};

export default formatCurrency;