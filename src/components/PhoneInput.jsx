import React, { useState } from 'react';

const PhoneInput = ({ 
  onSubmit,
  onCancel,
  initialPhone = '',
  initialCountryCode = '+91'
}) => {
  const [phoneData, setPhoneData] = useState({
    countryCode: '+91', // Fixed to India (+91)
    phone: initialPhone.replace('+91', '') // Remove country code if present
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    // Ensure only numbers are entered
    if (/^\d*$/.test(value)) {
      setPhoneData(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        countryCode: '+91', // Always submit with +91
        phone: phoneData.phone
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            COUNTRY CODE
          </label>
          <div className="flex items-center h-12 px-3 border border-ivory-300 bg-white text-charcoal-900 font-light">
            +91 (India)
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <label className="block text-xs font-medium tracking-wide text-charcoal-600 mb-1">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            value={phoneData.phone}
            onChange={handleChange}
            className="w-full h-12 px-3 border border-ivory-300 bg-white text-charcoal-900 
                      focus:outline-none focus:border-charcoal-500 font-light"
            placeholder="Enter 10-digit number"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            title="Please enter a 10-digit Indian phone number"
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-charcoal-900 text-black text-xs font-medium tracking-wide 
                    hover:bg-charcoal-800 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-charcoal-900 text-charcoal-900 text-xs 
                    font-medium tracking-wide hover:bg-ivory-200 transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default PhoneInput;