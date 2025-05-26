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

  const PICKUP_POSTCODE = "201001";
  const COUNTRY = "India";

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        setLoading(true);
        setError(null);
        setShippingRates([]); // Clear previous rates

        // Validation: Must be a 6-digit Indian PIN
        const pin = shippingAddress?.zip;
        
        if (!pin || !/^\d{6}$/.test(pin)) {
          const errorMsg = "Please provide a valid 6-digit Indian PIN code.";
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
        const cartWithWeights = await Promise.all(
          cart.map(async (item) => {
            const variantId = item.variantId.match(/\d+$/)?.[0];
            console.log(`Fetching weight for product ${item.id}, variant ${variantId}`);
            
            const weight = await fetchProductWeight(
              item.id,
              variantId
            );
            
            return { ...item, weight };
          })
        );

        const totalWeight = cartWithWeights.reduce(
          (sum, item) => sum + item.weight * item.quantity,
          0
        );
        

        if (totalWeight <= 0) {
          const errorMsg = "Cart items must have valid weight to calculate shipping.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        // Fetch Shiprocket shipping rates
        const params = new URLSearchParams({
          pickup_postcode: PICKUP_POSTCODE,
          delivery_postcode: pin,
          cod: 0,
          weight: totalWeight,
        });

        console.log('Shiprocket API params:', params.toString());
        
        const response = await fetch(
          `https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SHIPROCKET_API_TOKEN}`,
            },
          }
        );

        console.log('Shiprocket API response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Shiprocket API error:', errorData);
          throw new Error(errorData.message || "Failed to fetch shipping rates.");
        }

        const data = await response.json();
        
        // Check if data has the expected structure
        if (!data?.data?.available_courier_companies) {
          console.error('Unexpected Shiprocket response structure:', data);
          throw new Error("No shipping options available for this location.");
        }

        // Log each company's data before transformation
        data.data.available_courier_companies.forEach(company => {
          console.log(`Company: ${company.courier_name}`, {
            estimated_price: company.estimated_price,
            rate: company.rate,
            etd: company.etd,
            estimated_delivery_days: company.estimated_delivery_days
          });
        });

        // Transform the response into a more usable format
        const rates = data.data.available_courier_companies.map(company => {
          // Check which price field is available
          const priceValue = company.estimated_price || company.rate;
          console.log(`Processing ${company.courier_name}:`, {
            priceValue,
            estimated_price: company.estimated_price,
            rate: company.rate
          });
          
          return {
            id: company.courier_company_id.toString(),
            title: company.courier_name,
            price: priceValue ? `₹${priceValue}` : 'Price not available',
            deliveryTime: company.estimated_delivery_days 
              ? `${company.estimated_delivery_days} business days`
              : company.etd || "3-5 business days",
          };
        });

        console.log('Formatted shipping rates:', rates);
        setShippingRates(rates);
      } catch (err) {
        console.error("Shipping error:", err);
        setError(err.message || "Error fetching shipping rates.");
      } finally {
        setLoading(false);
        console.log('Finished shipping rates fetch attempt');
      }
    };

    if (shippingAddress?.zip && cart?.length > 0) {
      console.log('Conditions met - fetching shipping rates');
      fetchShippingRates();
    } else {
      console.log('Conditions not met for fetching shipping rates:', {
        hasZip: !!shippingAddress?.zip,
        hasCartItems: cart?.length > 0
      });
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
          <p className="text-charcoal-600">Enter a valid Indian PIN code to view shipping options.</p>
        </div>
      )}
    </div>
  );
};

export default CourierSelector;