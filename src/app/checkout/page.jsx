// src/app/checkout/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import UserInformationForm from "@/components/checkout/UserInformationForm";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import CourierSelector from "@/components/checkout/CourierSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentButton from "@/components/checkout/PaymentButton"; // Re-import PaymentButton
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import Link from "next/link";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    if (!user) {
      sessionStorage.setItem('checkoutRedirect', '/checkout');
      router.push("/account/login");
    }
  }, [cart, user, router]);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    alternateContactNumber: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: "",
    address1: user?.address?.address1 || "",
    address2: user?.address?.address2 || "",
    city: user?.address?.city || "",
    country: user?.address?.country || "India",
    zip: user?.address?.zip || "",
    province: user?.address?.province || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [shippingRates, setShippingRates] = useState([]);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("prepaid");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email || prev.email
      }));

      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        ...(user.address ? {
          address1: user.address.address1,
          address2: user.address.address2,
          city: user.address.city,
          country: user.address.country,
          zip: user.address.zip,
          province: user.address.province
        } : {})
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user || selectedPaymentMethod !== "prepaid") {
      const existingScript = document.getElementById('razorpay-checkout-script');
      if (existingScript) {
        existingScript.remove();
        setRazorpayLoaded(false);
      }
      return;
    }

    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("Missing Razorpay key ID in env");
      setError("Payment system error. Please contact support.");
      return;
    }

    const script = document.createElement("script");
    script.id = 'razorpay-checkout-script';
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load payment processor. Please refresh the page.");
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.remove();
      }
    };
  }, [user, selectedPaymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressSubmit = (address) => {
    setShippingAddress(address);
  };

  const updateAddress = async (address) => {
    try {
      const token = localStorage.getItem("shopifyAccessToken");
      const response = await fetch("/api/update-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  };

  // The handleSubmit function is now removed from CheckoutPage
  // and its logic is moved to the PaymentButton component.
  // The PaymentButton will receive all necessary props to perform the submission.

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 border border-ivory-300 text-center">
          <h2 className="text-2xl font-serif font-light tracking-wide text-charcoal-900 mb-4">
            LOGIN REQUIRED
          </h2>
          <p className="text-charcoal-600 mb-6">You need to be logged in to proceed with checkout.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account/login"
              className="px-6 py-3 bg-charcoal-900 text-white text-xs font-medium tracking-wide
                        hover:bg-charcoal-800 transition-colors"
              onClick={() => sessionStorage.setItem('checkoutRedirect', '/checkout')}
            >
              LOGIN
            </Link>
            <Link
              href="/account/register"
              className="px-6 py-3 border border-charcoal-900 text-charcoal-900 text-xs
                        font-medium tracking-wide hover:bg-ivory-200 transition-colors"
              onClick={() => sessionStorage.setItem('checkoutRedirect', '/checkout')}
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 border border-ivory-300 text-center">
          <h2 className="text-2xl font-serif font-light tracking-wide text-charcoal-900 mb-4">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-charcoal-600 mb-6">Add some products to your cart before checking out.</p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-charcoal-900 text-white text-xs font-medium tracking-wide
                      hover:bg-charcoal-800 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-light tracking-tight text-charcoal-900 text-center mb-12">
          CHECKOUT
        </h1>

        {error && (
          <div className="mb-8 p-4 border-l-4 border-red-600 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            <UserInformationForm
              formData={formData}
              handleChange={handleChange}
              user={user}
            />
<PaymentMethodSelector
                          selectedPaymentMethod={selectedPaymentMethod}
                          setSelectedPaymentMethod={setSelectedPaymentMethod}
                        />
                      </div>
            <ShippingAddressForm
              formData={shippingAddress}
              handleChange={handleShippingAddressChange}
              user={user}
              updateAddress={updateAddress}
              onSubmit={handleShippingAddressSubmit}
            />

            

            <CourierSelector
              shippingRates={shippingRates}
              setShippingRates={setShippingRates}
              selectedShippingRate={selectedShippingRate}
              setSelectedShippingRate={setSelectedShippingRate}
              shippingAddress={shippingAddress}
              cart={cart}
            />

            

          {/* Right Column - Order Summary */}
          <div className="lg:pl-8">
            <OrderSummary
              cart={cart}
              selectedShippingRate={selectedShippingRate}
              setTotal={setTotal}
            />

            <div className="mt-8 border-t border-ivory-300 pt-8">
              <PaymentButton
                loading={loading}
                setLoading={setLoading} // Pass setLoading
                selectedShippingRate={selectedShippingRate}
                cart={cart}
                razorpayLoaded={razorpayLoaded}
                selectedPaymentMethod={selectedPaymentMethod} // Pass payment method
                total={total} // Pass total
                formData={formData} // Pass user form data
                shippingAddress={shippingAddress} // Pass shipping address data
                setError={setError} // Pass setError function
              />

              <p className="mt-4 text-xs text-charcoal-600 text-center">
                By completing your purchase, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-charcoal-900">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;