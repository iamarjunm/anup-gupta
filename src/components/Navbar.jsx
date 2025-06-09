'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { FiUser, FiShoppingBag, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { useUser } from "@/context/UserContext"
import { useCart } from "@/context/CartContext"

import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'

// Import the CurrencySwitcher component
import CurrencySwitcher from '@/components/CurrencySwitcher' // Adjust the path as per your project structure

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false) // Dedicated state for collections
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)     // Dedicated state for account
  const mobileMenuRef = useRef(null);
  const collectionsDropdownRef = useRef(null); // Ref for desktop collections dropdown
  const accountDropdownRef = useRef(null); // Ref for desktop account dropdown

  const { scrollY } = useScroll()

  const { user, logout } = useUser()
  const { cart } = useCart();

  const router = useRouter()
  const pathname = usePathname()

  const isHomePage = pathname === '/'

  // Determine text color and background based on scroll and page
  const textColor = isHomePage
    ? (isScrolled ? 'text-black' : 'text-white')
    : 'text-black'

  const bgClass = isHomePage
    ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
    : 'bg-white shadow-md'

  // Premium Categories
  const categories = [
    { title: "All Collections", href: "/shop", description: "Explore our complete range" },
    { title: "Tuxedos", href: "/shop?category=tuxedo", description: "Black tie elegance" },
    { title: "Tailored Suits", href: "/shop?category=suits", description: "Custom-fit perfection" },
    { title: "Sherwanis", href: "/shop?category=sherwani", description: "Regal traditional wear" },
    { title: "Bandhgalas", href: "/shop?category=bandhgala", description: "Modern Indian formal" },
    { title: "Shirts", href: "/shop?category=shirts", description: "Refined sartorial foundations" }, // Added Shirts
    { title: "Nehru Jackets", href: "/shop?category=nehru-jacket", description: "Versatile sophistication" }
  ]

  // Profile items based on authentication status
  const profileItems = user
    ? [
        { label: "My Account", href: "/account" },
        { label: "Logout", action: () => handleLogout() }
      ]
    : [
        { label: "Login", href: "/account/login" },
        { label: "Register", href: "/account/register" }
      ]

  const handleLogout = () => {
    logout()
    router.push("/")
    setCollectionsDropdownOpen(false) // Close desktop collections dropdown
    setAccountDropdownOpen(false)     // Close desktop account dropdown
    setMobileMenuOpen(false)          // Close mobile menu
  }

  // Effect to handle scroll-triggered navbar style change
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10)
  })

  // Effect to close dropdowns and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside AND not on the open/close buttons
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && event.target.closest('button[aria-label="Open menu"], button[aria-label="Close menu"]') === null) {
        setMobileMenuOpen(false);
        setCollectionsDropdownOpen(false); // Close mobile dropdowns too
        setAccountDropdownOpen(false);    // Close mobile dropdowns too
      }
      // Close desktop collections dropdown if clicked outside
      if (collectionsDropdownRef.current && !collectionsDropdownRef.current.contains(event.target)) {
        setCollectionsDropdownOpen(false);
      }
      // Close desktop account dropdown if clicked outside
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Toggle functions for mobile dropdowns
  const toggleMobileCollectionsDropdown = () => {
    setCollectionsDropdownOpen(!collectionsDropdownOpen);
    // Close other mobile dropdowns when opening collections dropdown
    if (!collectionsDropdownOpen) {
      setAccountDropdownOpen(false);
    }
  };

  const toggleMobileAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
    // Close other mobile dropdowns when opening account dropdown
    if (!accountDropdownOpen) {
      setCollectionsDropdownOpen(false);
    }
  };

  // Function to handle navigation and close mobile menu
  const handleMobileNavigation = (href) => {
    router.push(href)
    setMobileMenuOpen(false)
    setCollectionsDropdownOpen(false) // Ensure mobile dropdowns are closed
    setAccountDropdownOpen(false)     // Ensure mobile dropdowns are closed
  }

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${bgClass}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">

          {/* Left - Desktop Menu */}
          <div className="hidden lg:flex items-center gap-12">
            {/* Collections Dropdown */}
            <div
              className="relative"
              ref={collectionsDropdownRef}
              onMouseEnter={() => setCollectionsDropdownOpen(true)} // Open on hover
              onMouseLeave={() => setCollectionsDropdownOpen(false)} // Close on mouse leave
            >
              <motion.button
                className={`text-sm font-medium uppercase tracking-wider flex items-center gap-1 ${textColor}`}
                onClick={() => setCollectionsDropdownOpen(!collectionsDropdownOpen)} // Toggle on click for desktop
              >
                Collections
                <motion.span
                  animate={{ rotate: collectionsDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className={textColor} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {collectionsDropdownOpen && ( // Only show if collectionsDropdownOpen is true
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 top-8 bg-white shadow-xl rounded-md z-50 border border-gray-100 overflow-hidden"
                  >
                    <div className="w-72 p-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Our Collections
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category, i) => (
                          <motion.a
                            key={i}
                            href={category.href}
                            onClick={() => setCollectionsDropdownOpen(false)} // Close dropdown on item click
                            className="block group"
                            whileHover={{ x: 2 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <div className="px-3 py-3 border-l-2 border-transparent group-hover:border-black transition-all">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-black">
                                {category.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {category.description}
                              </p>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.a
              href="/about"
              className={`text-sm font-medium uppercase tracking-wider ${textColor} hover:opacity-80 transition-opacity`}
              whileHover={{ scale: 1.03 }}
            >
              About
            </motion.a>
            <motion.a
              href="/contact"
              className={`text-sm font-medium uppercase tracking-wider ${textColor} hover:opacity-80 transition-opacity`}
              whileHover={{ scale: 1.03 }}
            >
              Contact
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`lg:hidden text-xl focus:outline-none ${textColor}`}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              // Close any desktop dropdowns when opening mobile menu
              setCollectionsDropdownOpen(false);
              setAccountDropdownOpen(false);
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>

          {/* Center Logo - Luxury Typography */}
          <motion.div
            className="text-2xl font-serif font-normal tracking-widest"
            whileHover={{ scale: 1.02 }}
          >
            <a href="/" className={`flex items-center ${textColor}`}>
              ANUP GUPTA
            </a>
          </motion.div>

          {/* Right - Icons and Currency Switcher */}
          <div className="flex items-center gap-8">
            {/* Currency Switcher */}
            <CurrencySwitcher /> {/* Here's the CurrencySwitcher imported */}

            {/* Account Dropdown */}
            <div
              className="relative hidden lg:block"
              ref={accountDropdownRef}
              onMouseEnter={() => setAccountDropdownOpen(true)} // Open on hover
              onMouseLeave={() => setAccountDropdownOpen(false)} // Close on mouse leave
            >
              <motion.button
                className={`flex items-center gap-1 ${textColor}`}
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)} // Toggle on click for desktop
                whileHover={{ scale: 1.05 }}
              >
                <FiUser size={20} />
                {user && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {accountDropdownOpen && ( // Only show if accountDropdownOpen is true
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 top-8 w-56 bg-white shadow-xl rounded-md py-2 z-50 border border-gray-100"
                  >
                    {profileItems.map((item) => (
                      item.href ? (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setAccountDropdownOpen(false)} // Close dropdown on item click
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            setAccountDropdownOpen(false); // Close dropdown on action
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {item.label}
                        </button>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart with Elegant Badge */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/cart" className={textColor}>
                <FiShoppingBag size={20} />
              </a>
              {/* Check if cart is defined and has items before rendering badge */}
              {cart && cart.length > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cart.length}
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Luxury Experience */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-40 pt-24 px-8"
            style={{ backdropFilter: 'blur(10px)' }}
            ref={mobileMenuRef}
          >
            <div className="flex flex-col gap-1">
              {/* Collections Mobile Dropdown */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full py-4 text-white border-b border-gray-800"
                  onClick={toggleMobileCollectionsDropdown}
                >
                  <span className="text-lg">Collections</span>
                  <FiChevronDown className={`transition-transform ${collectionsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {collectionsDropdownOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-4 pl-4 space-y-4">
                        {categories.map((category, i) => (
                          <button
                            key={i}
                            onClick={() => handleMobileNavigation(category.href)}
                            className="block w-full text-left"
                          >
                            <h3 className="text-white text-sm font-medium">
                              {category.title}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">
                              {category.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => handleMobileNavigation("/about")}
                className="py-4 border-b border-gray-800 text-white text-lg flex justify-between items-center w-full"
              >
                Heritage <span className="text-gray-500">→</span>
              </button>
              <button
                onClick={() => handleMobileNavigation("/contact")}
                className="py-4 border-b border-gray-800 text-white text-lg flex justify-between items-center w-full"
              >
                Contact <span className="text-gray-500">→</span>
              </button>

              {/* Mobile Account Dropdown */}
              <div className="py-4 border-b border-gray-800">
                <button
                  className="flex items-center justify-between w-full text-white text-lg"
                  onClick={toggleMobileAccountDropdown}
                >
                  <span>Account</span>
                  <FiChevronDown className={`transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {accountDropdownOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-4 pl-4">
                        {profileItems.map((item, index) => (
                          <div key={index} className="mb-2">
                            {item.href ? (
                              <button
                                onClick={() => handleMobileNavigation(item.href)}
                                className="text-gray-400 hover:text-white transition-colors text-sm py-1 block w-full text-left"
                              >
                                {item.label}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  item.action()
                                  setMobileMenuOpen(false) // Close mobile menu after action
                                  setAccountDropdownOpen(false) // Close account dropdown too
                                }}
                                className="text-gray-400 hover:text-white transition-colors text-sm py-1 block w-full text-left"
                              >
                                {item.label}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Switcher in Mobile Menu */}
              <div className="py-4 border-b border-gray-800">
                 <div className="flex items-center justify-between w-full text-white text-lg">
                    <span>Currency</span>
                    <CurrencySwitcher /> {/* Placed the CurrencySwitcher here for mobile */}
                 </div>
              </div>

            </div>

            <div className="mt-12 flex gap-8 justify-center">
              {user ? (
                <>
                  <span className="text-gray-400 text-sm">Welcome, {user.name}</span>
                </>
              ) : (
                <>
                  <button onClick={() => handleMobileNavigation("/account/login")} className="text-gray-400 hover:text-white text-sm">
                    Login
                  </button>
                  <button onClick={() => handleMobileNavigation("/account/register")} className="text-gray-400 hover:text-white text-sm">
                    Register
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}