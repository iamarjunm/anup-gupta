"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import formatCurrency from "@/lib/formatCurrency";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(variantId, newQuantity);
    } else {
      removeFromCart(variantId);
    }
  };

  const handleRemoveItem = (variantId) => {
    removeFromCart(variantId);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Empty State */}
      {cart.length === 0 ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-light tracking-tight mb-6">YOUR CART</h1>
          <p className="text-gray-500 mb-8">Your cart is currently empty</p>
          <Link
            href="/"
            className="inline-block border border-black px-8 py-3 text-sm tracking-widest hover:bg-gray-50 transition-colors duration-300"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl font-light tracking-tight mb-12 text-center">YOUR CART</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div key={item.variantId} className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-100">
                  {/* Product Image */}
                  <div className="w-full md:w-48 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder-luxury.jpg"}
                      alt={item.title}
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-light mb-1">{item.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">{item.size}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.variantId)}
                        className="text-xs text-gray-500 hover:text-black"
                      >
                        REMOVE
                      </button>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 w-fit">
                        <button
                          onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                          className="px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                          className="px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-light">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 p-6">
                <h2 className="text-lg font-light tracking-tight mb-6">ORDER SUMMARY</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-light">Total</span>
                    <span className="font-light">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center border border-black bg-black text-white py-3 px-6 text-sm tracking-widest hover:bg-gray-800 transition-colors duration-300"
                >
                  PROCEED TO CHECKOUT
                </Link>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Complimentary shipping and returns on all orders
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-block text-sm underline hover:text-gray-500"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;