'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Truck, CreditCard, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image for Next.js optimized images

const OrderDetailsPage = ({ params }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) throw new Error('Missing order ID');

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }

        const data = await response.json();
        if (!data) throw new Error('Order data not found');

        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Date not available';
    }
  };

  const requiresShipping =
    orderDetails?.shippingMethod && orderDetails.shippingMethod.toLowerCase() !== 'no shipping';

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-charcoal-900" />
          <h1 className="text-2xl font-serif text-charcoal-900 tracking-wide">
            Loading your order details
          </h1>
          <p className="text-charcoal-700">Please wait while we fetch your order information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h1 className="text-2xl font-serif text-charcoal-900 tracking-wide">Order Not Found</h1>
            <p className="text-charcoal-700">{error}</p>
            <p className="text-sm text-charcoal-600/70">Order ID: {orderId}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-charcoal-900 text-ivory-50 px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button and header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-charcoal-600 hover:text-charcoal-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>

          <h1 className="text-4xl font-serif font-normal tracking-tight mb-2 leading-tight">
            Order #{orderDetails?.orderNumber}
          </h1>
          <p className="text-charcoal-700 font-light">
            Placed on {formatDate(orderDetails?.createdAt)}
          </p>
        </motion.div>

        {/* Order status indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-4 mb-8 border border-gray-200 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`h-3 w-3 rounded-full ${
                orderDetails?.paymentStatus === 'paid'
                  ? 'bg-green-500' // Using a standard green for success
                  : orderDetails?.paymentStatus === 'pending'
                  ? 'bg-yellow-500' // Using a standard yellow for pending
                  : orderDetails?.paymentStatus === 'cancelled'
                  ? 'bg-red-500'
                  : 'bg-gray-500'
              }`}
            ></div>
            <span className="capitalize text-charcoal-900 font-medium">
              {orderDetails?.paymentStatus?.replace(/_/g, ' ').toLowerCase()}
            </span>
          </div>
          {orderDetails?.trackingInfo && (
            <a
              href={orderDetails.trackingInfo.trackingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-600 hover:text-charcoal-900 transition-colors text-sm"
            >
              Track Package &rarr;
            </a>
          )}
        </motion.div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-3 text-charcoal-900">
              <CreditCard className="h-5 w-5 text-charcoal-700" />
              Payment Details
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-700">Payment Method</span>
                <span className="capitalize text-charcoal-900 font-medium">
                  {orderDetails?.paymentMethod || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700">Payment Status</span>
                <span className="capitalize text-charcoal-900 font-medium">
                  {orderDetails?.paymentStatus?.replace(/_/g, ' ').toLowerCase()}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-3 text-charcoal-900">
              {requiresShipping ? <Truck className="h-5 w-5 text-charcoal-700" /> : <Package className="h-5 w-5 text-charcoal-700" />}
              {requiresShipping ? 'Shipping Information' : 'Delivery Information'}
            </h2>

            {requiresShipping ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Method</span>
                  <span className="text-charcoal-900 font-medium">{orderDetails?.shippingMethod}</span>
                </div>

                <div>
                  <span className="text-charcoal-700 block mb-1">Address</span>
                  <div className="text-right text-charcoal-900 font-medium leading-relaxed">
                    <div>
                      {orderDetails?.shippingAddress?.firstName} {orderDetails?.shippingAddress?.lastName}
                    </div>
                    <div className="text-charcoal-700 text-xs">
                      {orderDetails?.shippingAddress?.address1}
                      {orderDetails?.shippingAddress?.address2 && `, ${orderDetails.shippingAddress.address2}`}
                      <br />
                      {orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.provinceCode}{' '}
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
                        href={orderDetails.trackingInfo.trackingUrl || '#'}
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
                        {orderDetails.trackingInfo.status || 'Processing'}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white p-6 border border-gray-200 shadow-sm mb-10"
        >
          <h2 className="text-xl font-serif mb-6 text-charcoal-900">Items in Your Order</h2>
          <div className="divide-y divide-gray-200">
            {orderDetails?.items?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }} // Staggered animation
                className="py-4 flex items-center"
              >
                <div className="relative w-20 h-20 flex-shrink-0 mr-6 overflow-hidden border border-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill // Use fill for Image component
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
              <span className="text-charcoal-900 font-medium">₹{orderDetails?.subtotal?.toFixed(2) || orderDetails?.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700">Shipping</span>
              <span className="text-charcoal-900 font-medium">{requiresShipping ? 'Calculated at checkout' : 'Free'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-700">Tax</span>
              <span className="text-charcoal-900 font-medium">Included</span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg border-t border-gray-300">
              <span className="text-charcoal-900">Total</span>
              <span className="text-charcoal-900">₹{orderDetails?.total?.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Invoice Section */}
        {orderDetails?.invoiceUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white p-6 border border-gray-200 shadow-sm mb-10"
          >
            <h2 className="text-xl font-serif mb-6 text-charcoal-900">Order Invoice</h2>
            <div className="flex flex-col space-y-6">
              <iframe
                src={orderDetails.invoiceUrl}
                className="w-full h-[600px] border border-gray-300"
                title="Shopify Invoice"
                loading="lazy"
              />
              <div className="flex flex-wrap gap-4">
                <a
                  href={orderDetails.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-charcoal-900 text-ivory-50 px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-700 transition-colors"
                >
                  Open Full Invoice
                </a>
                <button
                  onClick={() => window.open(orderDetails.invoiceUrl, '_blank')?.print()}
                  className="border border-charcoal-900 text-charcoal-900 px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-900 hover:text-ivory-50 transition-colors"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white p-6 border border-gray-200 shadow-sm mb-10"
          >
            <p className="text-charcoal-700">Invoice not available for this order at the moment.</p>
          </motion.div>
        )}

        {/* Customer Support Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-ivory-50 p-6 border border-gray-200 shadow-sm mb-12" // Subtle background and shadow for the alert
        >
          <h2 className="text-xl font-serif mb-3 text-charcoal-900">Need Assistance?</h2>
          <p className="text-charcoal-700 mb-5 text-sm leading-relaxed">
            Should you have any inquiries regarding your order, our dedicated support team is here to help.
            Please reach out to us for a prompt resolution.
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
          transition={{ duration: 0.4, delay: 0.9 }}
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

export default OrderDetailsPage;