"use client";

import React, { useState } from "react";
import PhoneInput from "../PhoneInput";

const ProfileSection = ({ user, updateName, updatePhone }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user?.firstName || "");
  const [newLastName, setNewLastName] = useState(user?.lastName || "");
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const handleSaveName = async () => {
    await updateName(newFirstName, newLastName);
    setIsEditingName(false);
  };

  const handlePhoneSubmit = async (phoneData) => {
    await updatePhone(phoneData);
    setIsEditingPhone(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
        PROFILE INFORMATION
      </h2>
      
      <div className="space-y-6">
        {/* Name */}
        <div className="border-b border-ivory-300 pb-6">
          <div className="flex justify-between items-start mb-3">
            <label className="block text-sm font-medium tracking-wide text-charcoal-600">
              FULL NAME
            </label>
            {!isEditingName && (
              <button 
                onClick={() => setIsEditingName(true)}
                className="text-xs font-medium tracking-wide text-charcoal-500 hover:text-charcoal-900 underline"
              >
                EDIT
              </button>
            )}
          </div>
          
          {isEditingName ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 focus:outline-none focus:border-charcoal-500"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 focus:outline-none focus:border-charcoal-500"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSaveName} 
                  className="px-6 py-2 bg-charcoal-900 text-black text-xs font-medium tracking-wide hover:bg-charcoal-800 transition-colors"
                >
                  SAVE CHANGES
                </button>
                <button 
                  onClick={() => setIsEditingName(false)}
                  className="px-6 py-2 border border-charcoal-900 text-charcoal-900 text-xs font-medium tracking-wide hover:bg-ivory-200 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <p className="text-charcoal-900">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="border-b border-ivory-300 pb-6">
          <label className="block text-sm font-medium tracking-wide text-charcoal-600 mb-3">
            EMAIL ADDRESS
          </label>
          <p className="text-charcoal-900">{user.email}</p>
        </div>

        {/* Phone */}
        <div>
          <div className="flex justify-between items-start mb-3">
            <label className="block text-sm font-medium tracking-wide text-charcoal-600">
              PHONE NUMBER
            </label>
            {!isEditingPhone && (
              <button 
                onClick={() => setIsEditingPhone(true)}
                className="text-xs font-medium tracking-wide text-charcoal-500 hover:text-charcoal-900 underline"
              >
                EDIT
              </button>
            )}
          </div>
          
          {isEditingPhone ? (
            <PhoneInput 
              onSubmit={handlePhoneSubmit}
              onCancel={() => setIsEditingPhone(false)}
              initialPhone={user?.phone}
              initialCountryCode={user?.countryCode}
            />
          ) : (
            <p className="text-charcoal-900">
              {user.phone || "Not provided"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;