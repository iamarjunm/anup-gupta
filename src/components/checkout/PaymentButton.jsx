// src/components/checkout/PaymentButton.js
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const PaymentButton = ({
  loading,
  setLoading, // Pass setLoading from CheckoutPage
  selectedShippingRate,
  cart = [],
  razorpayLoaded = false,
  selectedPaymentMethod, // New prop
  total, // New prop
  formData, // New prop: User and contact info
  shippingAddress, // New prop: Shipping details
  setError // New prop: Function to set error message
}) => {
  const router = useRouter(); // Initialize useRouter

  const isRazorpayReady = razorpayLoaded && typeof window.Razorpay !== 'undefined';

  // Determine if the button should be disabled based on payment method
  const isDisabled = loading || !selectedShippingRate || cart.length === 0 ||
                     (selectedPaymentMethod === "prepaid" && !isRazorpayReady) ||
                     !selectedPaymentMethod; // Disable if no payment method is selected

  let tooltipMessage = '';

  if (loading) {
    tooltipMessage = 'Processing your order...';
  } else if (cart.length === 0) {
    tooltipMessage = 'Your cart is empty';
  } else if (!selectedShippingRate) {
    tooltipMessage = 'Please select a shipping method';
  } else if (!selectedPaymentMethod) {
    tooltipMessage = 'Please select a payment method';
  } else if (selectedPaymentMethod === "prepaid" && !isRazorpayReady) {
    tooltipMessage = 'Payment system loading...';
  }

  const handlePaymentSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Basic validations (redundant with CheckoutPage, but good for component self-sufficiency)
      if (!selectedShippingRate) throw new Error("Please select a shipping method.");
      if (!formData.email) throw new Error("Email is required.");
      if (!shippingAddress.phone) throw new Error("Phone number is required.");
      if (!selectedPaymentMethod) throw new Error("Please select a payment method.");

      // Prepare common order payload data
      const commonOrderPayload = {
        cart: cart.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          ...(item.customMeasurements && { customMeasurements: item.customMeasurements })
        })),
        email: formData.email,
        shippingAddress: {
          ...shippingAddress,
          countryCode: shippingAddress.countryCode || 'IN'
        },
        shippingOption: {
          title: selectedShippingRate.title,
          price: selectedShippingRate.price,
          code: selectedShippingRate.code || 'standard'
        },
        totalAmount: total,
        paymentMethod: selectedPaymentMethod,
      };

      if (selectedPaymentMethod === "prepaid") {
        // --- Prepaid (Razorpay) Flow ---
        if (!isRazorpayReady) throw new Error("Payment processor not loaded. Please refresh.");

        const razorpayResponse = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commonOrderPayload),
        });

        if (!razorpayResponse.ok) {
          const errorData = await razorpayResponse.json();
          throw new Error(errorData.error || "Payment initialization failed.");
        }

        const { orderId: razorpayOrderId } = await razorpayResponse.json();

        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "Anup Gupta Studio",
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              setLoading(true);
              const orderResponse = await fetch("/api/create-shopify-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...commonOrderPayload,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentStatus: 'paid'
                }),
              });

              if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || "Order creation failed after payment.");
              }

              const orderData = await orderResponse.json();
              router.push(`/order-confirmation?orderId=${orderData.orderId}`);

            } catch (error) {
              console.error("Order processing error:", error);
              setError(`Payment succeeded but order failed. Contact support with ID: ${response.razorpay_payment_id}`);
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: shippingAddress.phone,
          },
          notes: {
            internalNote: "Created via web checkout - Prepaid"
          }
        });

        rzp.on("payment.failed", (response) => {
          setError(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });

        rzp.open();

      } else if (selectedPaymentMethod === "cod") {
        // --- Cash on Delivery Flow ---
        const orderResponse = await fetch("/api/create-shopify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...commonOrderPayload,
            paymentStatus: 'pending'
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || "COD order creation failed.");
        }

        const orderData = await orderResponse.json();
        router.push(`/order-confirmation?orderId=${orderData.orderId}`);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group mt-8">
      <button
        type="button"
        className={`w-full py-4 px-8 border border-charcoal-900 text-charcoal-900 text-xs font-medium tracking-wide transition-all duration-300 ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-charcoal-900 hover:text-black hover:shadow-md' // Adjusted hover state for text-color
        }`}
        disabled={isDisabled}
        onClick={handlePaymentSubmission} // Call the new handler
        aria-label={tooltipMessage}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-charcoal-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            PROCESSING ORDER
          </span>
        ) : (
          `PLACE ORDER (₹${total.toFixed(2)})` // Display total on button
        )}
      </button>

      {/* Tooltip for disabled state */}
      {isDisabled && !loading && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal-900 text-black text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {tooltipMessage}
          <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-charcoal-900 border-transparent transform -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;