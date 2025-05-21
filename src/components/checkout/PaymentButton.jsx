import React from "react";

const PaymentButton = ({ 
  loading, 
  selectedShippingRate, 
  onClick,
  cart = [],
  razorpayLoaded = false
}) => {
  const isRazorpayReady = razorpayLoaded && typeof window.Razorpay !== 'undefined';
  const isDisabled = loading || !selectedShippingRate || cart.length === 0 || !isRazorpayReady;
  
  let tooltipMessage = '';
  
  if (loading) {
    tooltipMessage = 'Processing your order...';
  } else if (cart.length === 0) {
    tooltipMessage = 'Your cart is empty';
  } else if (!selectedShippingRate) {
    tooltipMessage = 'Please select a shipping method';
  } else if (!isRazorpayReady) {
    tooltipMessage = 'Payment system loading...';
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative group mt-8">
      <button
        type="button"
        className={`w-full py-4 px-8 border border-charcoal-900 text-charcoal-900 text-xs font-medium tracking-wide transition-all duration-300 ${
          isDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-charcoal-900 hover:text-black hover:shadow-md'
        }`}
        disabled={isDisabled}
        onClick={handleClick}
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
          "PLACE ORDER"
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