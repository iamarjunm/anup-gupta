"use client";

import React from "react";

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="w-full lg:w-64 bg-ivory-100 p-6 border border-ivory-300 rounded-none lg:rounded-sm">
      <h2 className="text-xl font-serif font-light tracking-wider mb-6 text-charcoal-900 border-b border-ivory-300 pb-3">
        MY ACCOUNT
      </h2>
      <ul className="space-y-1">
        {[
          { id: "profile", label: "Profile" },
          { id: "address", label: "Address Book" },
          { id: "orders", label: "Order History" },
          { id: "password", label: "Change Password" },
        ].map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-3 text-sm font-medium tracking-wide transition-all duration-200 ${
                activeSection === item.id
                  ? "text-charcoal-900 border-l-2 border-charcoal-900 pl-4"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:pl-4"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
        <li className="mt-6 pt-4 border-t border-ivory-300">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 text-sm font-medium tracking-wide text-charcoal-600 hover:text-charcoal-900 transition-all duration-200 hover:pl-4"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;