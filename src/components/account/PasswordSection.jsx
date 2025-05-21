"use client";

import React, { useState } from "react";

const PasswordSection = ({ updatePassword }) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      await updatePassword(currentPassword, newPassword);
      setIsEditingPassword(false);
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-light tracking-wide mb-6 text-charcoal-900">
        PASSWORD
      </h2>
      
      <div className="border border-ivory-300 p-6">
        {isEditingPassword ? (
          <div className="space-y-6">
            {error && (
              <div className="text-sm text-red-600 border-l-2 border-red-600 pl-3">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                CURRENT PASSWORD *
              </label>
              <input
                type="password"
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                NEW PASSWORD *
              </label>
              <input
                type="password"
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
                CONFIRM NEW PASSWORD *
              </label>
              <input
                type="password"
                className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                          focus:outline-none focus:border-charcoal-500 font-light"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setIsEditingPassword(false);
                  setError("");
                }}
                className="px-6 py-2 border border-charcoal-900 text-charcoal-900 
                          text-xs font-medium tracking-wide hover:bg-ivory-200 transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSavePassword}
                className="px-6 py-2 bg-charcoal-900 text-white text-xs font-medium 
                          tracking-wide hover:bg-charcoal-800 transition-colors"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button 
              onClick={() => setIsEditingPassword(true)}
              className="px-6 py-3 border border-charcoal-900 text-charcoal-900 
                        text-xs font-medium tracking-wide hover:bg-ivory-200 transition-colors"
            >
              CHANGE PASSWORD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordSection;