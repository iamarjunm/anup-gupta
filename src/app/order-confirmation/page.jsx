"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Truck, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Image for Next.js optimized images

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-charcoal-900" />
      <h1 className="text-2xl font-serif text-charcoal-900 tracking-wide">
        Loading your order details
      </h1>
      <p className="text-charcoal-700">Please wait while we confirm your order.</p>
    </div>
  </div>
);

// Error component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
    <div className="max-w-md text-center space-y-6">
      <div className="space-y-2">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
        <h1 className="text-2xl font-serif text-charcoal-900 tracking-wide">Order Not Found</h1>
        <p className="text-charcoal-700">{error}</p>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="bg-charcoal-900 text-ivory-50 px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-700 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-charcoal-900 text-charcoal-900 px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-900 hover:text-ivory-50 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  </div>
);

// Main order content component
const OrderContent = ({ orderDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date not available";
    }
  };

  const requiresShipping =
    orderDetails?.shippingMethod &&
    orderDetails.shippingMethod.toLowerCase() !== "no shipping";

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-5" />
          <h1 className="text-5xl font-serif font-normal tracking-tight mb-3 leading-tight">
            Order Confirmed!
          </h1>
          <p className="text-xl text-charcoal-700 font-light">
            Your order #{orderDetails?.orderNumber} has been successfully placed.
          </p>
        </motion.div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-3 text-charcoal-900">
              <CreditCard className="h-5 w-5 text-charcoal-700" />
              Order Details
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-700">Order Number</span>
                <span className="font-mono text-charcoal-900 font-medium">
                  #{orderDetails?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700">Date</span>
                <span className="text-charcoal-900 font-medium">
                  {formatDate(orderDetails?.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700">Payment Status</span>
                <span className="capitalize text-charcoal-900 font-medium">
                  {orderDetails?.paymentStatus?.replace(/_/g, " ").toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="text-charcoal-900 text-lg font-semibold">Total Amount</span>
                <span className="font-semibold text-xl text-charcoal-900">
                  ₹{orderDetails?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping/Delivery Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-3 text-charcoal-900">
              {requiresShipping ? (
                <Truck className="h-5 w-5 text-charcoal-700" />
              ) : (
                <Package className="h-5 w-5 text-charcoal-700" />
              )}
              {requiresShipping ? "Shipping Information" : "Delivery Information"}
            </h2>

            {requiresShipping ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Method</span>
                  <span className="text-charcoal-900 font-medium">
                    {orderDetails?.shippingMethod}
                  </span>
                </div>

                <div>
                  <span className="text-charcoal-700 block mb-1">Address</span>
                  <div className="text-right text-charcoal-900 font-medium leading-relaxed">
                    <div>
                      {orderDetails?.shippingAddress?.firstName}{" "}
                      {orderDetails?.shippingAddress?.lastName}
                    </div>
                    <div className="text-charcoal-700 text-xs">
                      {orderDetails?.shippingAddress?.address1}
                      {orderDetails?.shippingAddress?.address2 &&
                        `, ${orderDetails.shippingAddress.address2}`}
                      <br />
                      {orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.provinceCode}{" "}
                      {orderDetails?.shippingAddress?.zip}
                      <br />
                      {orderDetails?.shippingAddress?.country}
                    </div>
                  </div>
                </div>

                {orderDetails?.trackingInfo ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-charcoal-700">Tracking Number</span>
                      <a
                        href={orderDetails.trackingInfo.trackingUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal-600 hover:text-charcoal-900 transition-colors font-medium"
                      >
                        {orderDetails.trackingInfo.trackingId} &rarr;
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-700">Tracking Status</span>
                      <span className="capitalize text-charcoal-900 font-medium">
                        {orderDetails.trackingInfo.status || "Processing"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-charcoal-700">
                    Your shipping details will be updated soon.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="text-charcoal-700">This is a digital order.</div>
                <div className="pt-2 text-xs text-charcoal-600/70">
                  You'll receive access details via email.
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Items */}
        {orderDetails?.items?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white p-6 shadow-sm border border-gray-200 mb-10"
          >
            <h2 className="text-xl font-serif mb-6 text-charcoal-900">Your Items</h2>
            <div className="divide-y divide-gray-200">
              {orderDetails.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="py-4 flex items-center"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 mr-6 overflow-hidden border border-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Package className="h-8 w-8 text-charcoal-700 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-charcoal-900 text-base">{item.name}</h3>
                    <p className="text-sm text-charcoal-700 mt-1">
                      {item.variant && `${item.variant} • `}Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-charcoal-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6 mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-700">Subtotal</span>
                <span className="text-charcoal-900 font-medium">
                  ₹{orderDetails?.subtotal?.toFixed(2) || orderDetails?.total?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700">Shipping</span>
                <span className="text-charcoal-900 font-medium">
                  {requiresShipping ? "Calculated at checkout" : "Free"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700">Tax</span>
                <span className="text-charcoal-900 font-medium">Included</span>
              </div>
              <div className="flex justify-between pt-4 font-bold text-lg border-t border-gray-300">
                <span className="text-charcoal-900">Total</span>
                <span className="text-charcoal-900">
                  ₹{orderDetails?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customer Support Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-ivory-50 p-6 border border-gray-200 shadow-sm mb-12"
        >
          <h2 className="text-xl font-serif mb-3 text-charcoal-900">Need Assistance?</h2>
          <p className="text-charcoal-700 mb-5 text-sm leading-relaxed">
            Should you have any inquiries regarding your order, our dedicated support team is here
            to help. Please reach out to us for a prompt resolution.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-charcoal-900 hover:text-charcoal-700 transition-colors text-sm font-medium uppercase tracking-wider"
          >
            Contact Customer Support &rarr;
          </Link>
        </motion.div>

        {/* Continue Shopping Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="bg-charcoal-900 text-ivory-50 px-8 py-3.5 uppercase tracking-wider text-sm font-semibold inline-block hover:bg-charcoal-700 transition-colors shadow-md"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const OrderConfirmationPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderConfirmationContent />
    </Suspense>
  );
};

// Inner component that uses useSearchParams
const OrderConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderId = searchParams.get("orderId");
        if (!orderId) throw new Error("Missing order ID");

        const data = await fetchOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [searchParams]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const orderId = searchParams.get("orderId");
    if (orderId) {
      fetchOrderDetails(orderId)
        .then(setOrderDetails)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;
  if (!orderDetails)
    return <ErrorDisplay error="No order data found" onRetry={handleRetry} />;

  return <OrderContent orderDetails={orderDetails} />;
};

export default OrderConfirmationPage;