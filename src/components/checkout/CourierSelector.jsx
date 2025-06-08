import React, { useEffect, useState } from "react";
import { fetchProductWeight } from "@/lib/fetchProductWeight.js";
import { Loader2 } from "lucide-react";

const CourierSelector = ({
  shippingRates,
  setShippingRates,
  selectedShippingRate,
  setSelectedShippingRate,
  shippingAddress,
  cart,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PICKUP_POSTCODE_INDIA = "201001"; // For Indian domestic shipments
  const PICKUP_COUNTRY_INDIA = "India";

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        setLoading(true);
        setError(null);
        setShippingRates([]); // Clear previous rates

        const deliveryZip = shippingAddress?.zip;
        const deliveryCountry = shippingAddress?.country; // Assuming you get this from your address object
        // deliveryCity and deliveryState are not needed for fixed rates, but kept for context if you expand later.
        // const deliveryCity = shippingAddress?.city;
        // const deliveryState = shippingAddress?.state;

        // Basic validation for delivery address
        if (!deliveryZip && !deliveryCountry) {
          const errorMsg = "Please provide a valid delivery address (ZIP/Postal Code and Country) to calculate shipping.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        // Don't proceed if cart is empty
        if (!cart || cart.length === 0) {
          const errorMsg = "Your cart is empty.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        // Fetch weights for all cart items (still good practice even for fixed rates)
        const cartWithWeights = await Promise.all(
          cart.map(async (item) => {
            const variantId = item.variantId ? item.variantId.match(/\d+$/)?.[0] : null;
            console.log(`Fetching weight for product ${item.id}, variant ${variantId}`);

            const weight = await fetchProductWeight(
              item.id,
              variantId
            );

            return { ...item, weight };
          })
        );

        const totalWeight = cartWithWeights.reduce(
          (sum, item) => sum + (item.weight || 0) * item.quantity,
          0
        );

        if (totalWeight <= 0) {
          const errorMsg = "Cart items must have valid weight to calculate shipping.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        // --- Logic to handle Domestic vs. International Shipping ---
        if (deliveryCountry === PICKUP_COUNTRY_INDIA) {
          // Domestic Shipping (India) - Fixed Rate
          console.log('Calculating domestic shipping rates - applying fixed rate.');
          const domesticRate = {
            id: "domestic-standard-service", // Unique ID for domestic
            title: "Standard Shipping",
            price: "₹200.00", // Fixed charge of 150
            deliveryTime: "3-7 business days", // Typical domestic delivery time
          };
          setShippingRates([domesticRate]); // Set this single fixed rate for domestic
          console.log('Formatted domestic fixed shipping rate:', domesticRate);

        } else {
          // International Shipping - Fixed Rate
          console.log('Calculating international shipping rates - applying fixed rate.');
          const internationalRate = {
            id: "international-standard-service", // Unique ID for international
            title: "International Standard Service",
            price: "₹1500.00", // Fixed charge of 1500
            deliveryTime: "10-15 business days", // Example delivery time for international
          };
          setShippingRates([internationalRate]); // Set this single fixed rate for international
          console.log('Formatted international fixed shipping rate:', internationalRate);
        }

      } catch (err) {
        console.error("Shipping error:", err);
        setError(err.message || "Error fetching shipping rates.");
      } finally {
        setLoading(false);
        console.log('Finished shipping rates fetch attempt');
      }
    };

    // Trigger fetch if we have enough address info and cart items
    if (shippingAddress?.zip && shippingAddress?.country && cart?.length > 0) {
      console.log('Conditions met - fetching shipping rates');
      fetchShippingRates();
    } else {
      console.log('Conditions not met for fetching shipping rates:', {
        hasZip: !!shippingAddress?.zip,
        hasCountry: !!shippingAddress?.country,
        hasCartItems: cart?.length > 0
      });
      // Clear rates and error if conditions are not met, to avoid showing stale info
      setShippingRates([]);
      setError("Please provide a complete shipping address and ensure your cart is not empty to see shipping options.");
    }
  }, [shippingAddress, cart, setShippingRates]);

  return (
    <div className="border border-ivory-300 bg-white p-6">
      <h2 className="text-xl font-serif font-light tracking-wide text-charcoal-900 mb-6 border-b border-ivory-300 pb-3">
        SHIPPING OPTIONS
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-charcoal-600" />
          <span className="ml-2 text-sm text-charcoal-600">Calculating shipping options...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border-l-4 border-red-600">
          {error}
        </div>
      )}

      {!loading && !error && shippingRates?.length > 0 ? (
        <div className="space-y-4">
          {shippingRates.map((rate) => (
            <div
              key={rate.id}
              className={`p-5 border ${
                selectedShippingRate?.id === rate.id
                  ? "border-charcoal-900"
                  : "border-ivory-300 hover:border-charcoal-500"
              } transition-colors`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="font-light text-charcoal-900">{rate.title}</p>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Estimated delivery: {rate.deliveryTime}
                  </p>
                </div>
                <div className="flex flex-col md:items-end">
                  <p className="text-lg font-light text-charcoal-900">{rate.price}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedShippingRate(rate);
                    }}
                    className={`mt-2 px-4 py-2 text-xs font-medium tracking-wide ${
                      selectedShippingRate?.id === rate.id
                        ? "bg-charcoal-900 text-black"
                        : "border border-charcoal-900 text-charcoal-900 hover:bg-ivory-200"
                    } transition-colors`}
                  >
                    {selectedShippingRate?.id === rate.id ? "SELECTED" : "SELECT"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error && (
        <div className="border border-ivory-300 p-6 text-center">
          <p className="text-charcoal-600">Enter a complete shipping address to view shipping options.</p>
        </div>
      )}
    </div>
  );
};

export default CourierSelector;