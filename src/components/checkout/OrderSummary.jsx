import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import formatCurrency from "@/lib/formatCurrency";

const OrderSummary = ({ cart, selectedShippingRate, setTotal }) => {
  // Validate props
  if (!Array.isArray(cart)) {
    console.error("Invalid cart prop - expected array, received:", typeof cart);
    return <div className="text-red-600">Invalid cart data</div>;
  }

  // Calculate subtotal using useMemo for performance
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      if (!item || typeof item.price !== "number" || typeof item.quantity !== "number") {
        console.warn("Invalid cart item:", item);
        return total;
      }
      return total + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  // Parse shipping cost safely
  const shippingCost = useMemo(() => {
    if (!selectedShippingRate) return 0;
    
    try {
      if (typeof selectedShippingRate.price === "string") {
        return parseFloat(selectedShippingRate.price.replace(/[^\d.]/g, "")) || 0;
      }
      return selectedShippingRate.rate || 0;
    } catch (error) {
      console.error("Error parsing shipping rate:", error);
      return 0;
    }
  }, [selectedShippingRate]);

  // Calculate total
  const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

  // Pass total to parent
  useEffect(() => {
    if (typeof setTotal === "function") {
      setTotal(total);
    }
  }, [total, setTotal]);

  // Format price safely
  const formatPrice = (price) => {
    try {
      return formatCurrency(price);
    } catch (error) {
      console.error("Error formatting price:", error);
      return "₹0.00";
    }
  };

  return (
    <div className="lg:pl-8">
      <h2 className="text-xl font-serif font-light tracking-wide text-charcoal-900 mb-6 border-b border-ivory-300 pb-3">
        ORDER SUMMARY
      </h2>
      
      <div className="border border-ivory-300 p-6">
        {/* Cart items */}
        {cart.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.variantId}`} 
                className="flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-light text-charcoal-900">
                    {item.title || "Unnamed Item"}
                  </p>
                  {item.variantTitle && (
                    <p className="text-sm text-charcoal-600 mt-1">
                      {item.variantTitle}
                    </p>
                  )}
                  <p className="text-xs text-charcoal-600 mt-1">
                    Qty: {item.quantity || 1}
                  </p>
                </div>
                <p className="font-light text-charcoal-900">
  {formatPrice((item.price || 0) * (item.quantity || 1))}
</p>

              </div>
            ))}
          </div>
        ) : (
          <div className="border border-ivory-300 p-6 text-center mb-6">
            <p className="text-charcoal-600">Your cart is empty</p>
          </div>
        )}

        {/* Shipping */}
        {selectedShippingRate && (
          <div className="flex justify-between items-center py-4 border-t border-ivory-300">
            <div>
              <p className="text-sm font-medium tracking-wide text-charcoal-600">SHIPPING</p>
              <p className="text-sm text-charcoal-600 mt-1">
                {selectedShippingRate.title || selectedShippingRate.courier_name || "Standard Shipping"}
              </p>
              {selectedShippingRate.deliveryTime && (
                <p className="text-xs text-charcoal-600 mt-1">
                  Est. delivery: {selectedShippingRate.deliveryTime}
                </p>
              )}
            </div>
            <p className="font-light text-charcoal-900">
              {formatPrice(shippingCost)}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-ivory-300">
          <p className="text-lg font-light text-charcoal-900">TOTAL</p>
          <p className="text-lg font-light text-charcoal-900">
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      variantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      variantTitle: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
    })
  ).isRequired,
  selectedShippingRate: PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.number,
    title: PropTypes.string,
    courier_name: PropTypes.string,
    deliveryTime: PropTypes.string,
  }),
  setTotal: PropTypes.func,
};

OrderSummary.defaultProps = {
  cart: [],
  selectedShippingRate: null,
  setTotal: () => {},
};

export default OrderSummary;