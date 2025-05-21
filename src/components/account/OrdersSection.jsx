"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const OrdersSection = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Unknown date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
          ORDER HISTORY
        </h2>
        <div className="border border-ivory-300 p-12 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-charcoal-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
          ORDER HISTORY
        </h2>
        <div className="border border-ivory-300 p-6 text-red-600">
          <p className="text-sm">Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
          ORDER HISTORY
        </h2>
        <div className="border border-ivory-300 p-8 text-center">
          <p className="text-charcoal-600 mb-4">You haven't placed any orders yet.</p>
          <Link 
            href="/products" 
            className="text-xs font-medium tracking-wide text-charcoal-900 hover:text-charcoal-700 underline"
          >
            BROWSE OUR COLLECTION
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
        ORDER HISTORY
      </h2>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border border-ivory-300 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h3 className="font-light text-charcoal-900">ORDER #{order.orderNumber}</h3>
                <p className="text-sm text-charcoal-600 mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></span>
                <span className="text-xs font-medium tracking-wide text-charcoal-600 capitalize">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              {order.lineItems.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-start py-2">
                  {item.image && (
                    <div className="w-16 h-20 bg-ivory-100 mr-4 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-light text-charcoal-900">{item.name}</p>
                    <p className="text-sm text-charcoal-600 mt-1">
                      {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              {order.lineItems.length > 3 && (
                <p className="text-xs text-charcoal-600">
                  +{order.lineItems.length - 3} more items
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-4 border-t border-ivory-300">
              <p className="font-light text-charcoal-900 mb-2 md:mb-0">
                ₹{order.total.toFixed(2)}
              </p>
              <Link 
                href={`/account/orders/${order.id}`}
                className="text-xs font-medium tracking-wide text-charcoal-900 hover:text-charcoal-700 underline"
              >
                VIEW ORDER DETAILS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;