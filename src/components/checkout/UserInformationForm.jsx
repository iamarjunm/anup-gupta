import React from "react";

const UserInformationForm = ({ formData, handleChange, user }) => {
  return (
    <div className="border border-ivory-300 p-6">
      <h2 className="text-xl font-serif font-light tracking-wide text-charcoal-900 mb-6 border-b border-ivory-300 pb-3">
        CONTACT INFORMATION
      </h2>
      
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            FULL NAME *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                      focus:outline-none focus:border-charcoal-500 font-light"
            required
            readOnly={!!user}
          />
          {user && (
            <p className="text-xs text-charcoal-500 mt-1">
              To change your name, please update your profile information.
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            EMAIL ADDRESS *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-ivory-300 bg-white text-charcoal-900 
                      focus:outline-none focus:border-charcoal-500 font-light"
            required
            readOnly={!!user}
          />
          {user && (
            <p className="text-xs text-charcoal-500 mt-1">
              To change your email, please contact customer service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInformationForm;