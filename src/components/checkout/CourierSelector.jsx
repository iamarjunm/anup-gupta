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
        const deliveryCity = shippingAddress?.city; // May be needed for international
        const deliveryState = shippingAddress?.state; // May be needed for international

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

        // Fetch weights for all cart items
        // This is needed for international shipping as well, even if the rate is fixed,
        // you might still want to ensure there's a valid total weight for future integrations.
        const cartWithWeights = await Promise.all(
          cart.map(async (item) => {
            const variantId = item.variantId ? item.variantId.match(/\d+$/)?.[0] : null; // Handle cases where variantId might be null/undefined
            console.log(`Fetching weight for product ${item.id}, variant ${variantId}`);

            const weight = await fetchProductWeight(
              item.id,
              variantId
            );

            return { ...item, weight };
          })
        );

        const totalWeight = cartWithWeights.reduce(
          (sum, item) => sum + (item.weight || 0) * item.quantity, // Default weight to 0 if null/undefined
          0
        );

        if (totalWeight <= 0) {
          const errorMsg = "Cart items must have valid weight to calculate shipping.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        let response;
        let data;

        // --- Logic to handle Domestic vs. International Shipping ---
        if (deliveryCountry === PICKUP_COUNTRY_INDIA) {
          // Domestic Shipping (India)
          console.log('Calculating domestic shipping rates...');
          const params = new URLSearchParams({
            pickup_postcode: PICKUP_POSTCODE_INDIA,
            delivery_postcode: deliveryZip,
            cod: 0,
            weight: totalWeight,
          });

          console.log('Shiprocket Domestic API params:', params.toString());

          response = await fetch(
            `https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SHIPROCKET_API_TOKEN}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Shiprocket Domestic API error:', errorData);
            throw new Error(errorData.message || "Failed to fetch domestic shipping rates.");
          }

          data = await response.json();

          if (!data?.data?.available_courier_companies) {
              console.error('Unexpected Shiprocket response structure (domestic):', data);
              throw new Error("No domestic shipping options available for this location.");
          }
           // Transform the response into a more usable format for domestic
          const rates = data.data.available_courier_companies.map(company => {
              const priceValue = company.estimated_price || company.rate;
              return {
                  id: company.courier_company_id.toString(),
                  title: company.courier_name,
                  price: priceValue ? `₹${priceValue}` : 'Price not available',
                  deliveryTime: company.estimated_delivery_days
                      ? `${company.estimated_delivery_days} business days`
                      : company.etd || "3-5 business days",
              };
          });
          console.log('Formatted domestic shipping rates:', rates);
          setShippingRates(rates);

        } else {
          // International Shipping - Fixed Rate Logic
          console.log('Calculating international shipping rates - applying fixed rate.');
          // Define the fixed international shipping rate
          const internationalRate = {
            id: "international-standard-service", // Unique ID
            title: "International Standard Service",
            price: "₹1500.00", // Fixed charge of 1500, formatted with ₹
            deliveryTime: "10-15 business days", // Example delivery time for international
          };

          setShippingRates([internationalRate]); // Set this single fixed rate
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