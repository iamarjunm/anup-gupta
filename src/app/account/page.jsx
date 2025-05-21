"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/account/Sidebar";
import ProfileSection from "@/components/account/ProfileSection";
import AddressSection from "@/components/account/AddressSection";
import OrdersSection from "@/components/account/OrdersSection";
import PasswordSection from "@/components/account/PasswordSection";
import Loader from "@/components/Loader";

const AccountPage = () => {
  const { user, loading, updateAddress, logout, updatePhone, updateName, updatePassword, deleteAddress } = useUser();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("profile");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <p className="text-charcoal-900 text-lg">Please sign in to access your account</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-light tracking-tight mb-8">
          Your Account
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white p-8 border border-ivory-300">
              {activeSection === "profile" && (
                <ProfileSection
                  user={user}
                  updateName={updateName}
                  updatePhone={updatePhone}
                />
              )}
              {activeSection === "address" && (
                <AddressSection
                  user={user}
                  updateAddress={updateAddress}
                  deleteAddress={deleteAddress}
                />
              )}
              {activeSection === "orders" && <OrdersSection />}
              {activeSection === "password" && (
                <PasswordSection
                  updatePassword={updatePassword}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;