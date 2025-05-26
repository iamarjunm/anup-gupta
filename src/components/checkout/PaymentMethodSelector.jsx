// src/components/checkout/PaymentMethodSelector.js
import React from 'react';

const PaymentMethodSelector = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  return (
    <div className="bg-white p-6 border border-ivory-300 rounded-md shadow-sm">
      <h2 className="text-xl font-serif font-light tracking-wide text-charcoal-900 mb-6">
        PAYMENT METHOD
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="prepaidPayment"
            name="paymentMethod"
            value="prepaid"
            checked={selectedPaymentMethod === "prepaid"}
            onChange={() => setSelectedPaymentMethod("prepaid")}
            className="h-4 w-4 text-charcoal-900 border-ivory-300 focus:ring-charcoal-900"
          />
          <label htmlFor="prepaidPayment" className="ml-3 block text-sm font-medium text-charcoal-700">
            Prepaid (Pay Online via Razorpay)
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="codPayment"
            name="paymentMethod"
            value="cod"
            checked={selectedPaymentMethod === "cod"}
            onChange={() => setSelectedPaymentMethod("cod")}
            className="h-4 w-4 text-charcoal-900 border-ivory-300 focus:ring-charcoal-900"
          />
          <label htmlFor="codPayment" className="ml-3 block text-sm font-medium text-charcoal-700">
            Cash on Delivery (COD)
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;