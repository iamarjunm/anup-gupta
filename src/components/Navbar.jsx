'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { FiUser, FiShoppingBag, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopHovered, setShopHovered] = useState(false)
  const [accountHovered, setAccountHovered] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const shopRef = useRef(null)
  const accountRef = useRef(null)
  const { scrollY } = useScroll()
  
  const { user, logout } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const isHomePage = pathname === '/'

  // Text color and background logic
  const textColor = isHomePage 
    ? (isScrolled ? 'text-black' : 'text-white')
    : 'text-black'

  const bgClass = isHomePage 
    ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
    : 'bg-white shadow-md'

  // Premium Formal Wear Categories
  const categories = [
    {
      title: "Tuxedo",
      items: ["Black Tie", "White Tie", "Modern Slim Fit", "Bespoke Tuxedos"]
    },
    {
      title: "Suits",
      items: ["Executive Collection", "Wool Suits", "Three-Piece", "Custom Tailored"]
    },
    {
      title: "Sherwani",
      items: ["Wedding Collection", "Embroidered", "Silk Sherwanis", "Contemporary Cuts"]
    },
    {
      title: "Shirts",
      items: ["French Cuff", "Tuxedo Shirts", "Premium Cotton", "Custom Monogramming"]
    },
    {
      title: "Nehru Jacket",
      items: ["Classic Black", "Jacquard Fabrics", "Bandhgala Styles", "Evening Wear"]
    }
  ]

  // Profile items based on authentication status
  const profileItems = user
    ? [
        { label: "Client Profile", href: "/client-profile" },
        { label: "Fitting Appointments", href: "/appointments" },
        { label: "Saved Measurements", href: "/measurements" },
        { label: "Logout", action: () => handleLogout() }
      ]
    : [
        { label: "Login", href: "/account/login" },
        { label: "Register", href: "/account/register" },
        { label: "Private Consultation", href: "/contact" }
      ]

  const handleLogout = () => {
    logout()
    router.push("/")
    setAccountHovered(false)
    setMobileMenuOpen(false)
  }

  // Scroll effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10)
  })

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopHovered(false)
        setActiveCategory(null)
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountHovered(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            {/* Shop Mega Menu */}
            <div 
              className="relative" 
              ref={shopRef}
              onMouseEnter={() => setShopHovered(true)}
              onMouseLeave={() => {
                setShopHovered(false)
                setActiveCategory(null)
              }}
            >
              <motion.button 
                className={`text-sm font-medium uppercase tracking-wider flex items-center gap-1 ${textColor}`}
              >
                Collections
                <motion.span
                  animate={{ rotate: shopHovered ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className={textColor} />
                </motion.span>
              </motion.button>
              
              <AnimatePresence>
                {shopHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 top-8 bg-white shadow-xl rounded-md z-50 border border-gray-100 overflow-hidden"
                    style={{ width: '800px' }}
                  >
                    <div className="flex">
                      {/* Category List */}
                      <div className="w-1/3 border-r border-gray-100">
                        {categories.map((category, i) => (
                          <div 
                            key={i}
                            className={`px-4 py-3 cursor-pointer transition-colors ${
                              activeCategory === i ? 'bg-gray-50' : 'hover:bg-gray-50'
                            }`}
                            onMouseEnter={() => setActiveCategory(i)}
                          >
                            <h3 className="text-sm font-medium text-gray-900">
                              {category.title}
                            </h3>
                          </div>
                        ))}
                      </div>
                      
                      {/* Items Panel */}
                      <div className="w-2/3 p-4">
                        {activeCategory !== null && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                              {categories[activeCategory].title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {categories[activeCategory].items.map((item, j) => (
                                <a
                                  key={j}
                                  href="#"
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded hover:text-black transition-colors"
                                >
                                  {item}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <a 
                            href="/bespoke" 
                            className="inline-flex items-center text-sm font-medium text-black hover:underline"
                          >
                            Bespoke Tailoring Service →
                          </a>
                        </div>
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
              Heritage
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
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

          {/* Right - Icons */}
          <div className="flex items-center gap-8">
            {/* Account Dropdown */}
            <div 
              className="relative hidden lg:block" 
              ref={accountRef}
              onMouseEnter={() => setAccountHovered(true)}
              onMouseLeave={() => setAccountHovered(false)}
            >
              <motion.button 
                className={`flex items-center gap-1 ${textColor}`}
                whileHover={{ scale: 1.05 }}
              >
                <FiUser size={20} />
                {user && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
              
              <AnimatePresence>
                {accountHovered && (
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
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          key={item.label}
                          onClick={item.action}
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
              <motion.span 
                className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                0
              </motion.span>
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
          >
            <div className="flex flex-col gap-1">
              {/* Shop Mobile Dropdown */}
              <div className="mb-4">
                <button 
                  className="flex items-center justify-between w-full py-4 text-white border-b border-gray-800"
                  onClick={() => setActiveCategory(activeCategory === -1 ? null : -1)}
                >
                  <span className="text-lg">Collections</span>
                  <FiChevronDown className={`transition-transform ${activeCategory === -1 ? 'rotate-180' : ''}`} />
                </button>
                
                {activeCategory === -1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 pl-4">
                      {categories.map((category, i) => (
                        <div key={i} className="mb-6">
                          <h3 className="text-white text-sm font-medium mb-3">
                            {category.title}
                          </h3>
                          <div className="flex flex-col gap-2 pl-2">
                            {category.items.map((item, j) => (
                              <a
                                key={j}
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors text-sm py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                      <a 
                        href="/bespoke" 
                        className="text-white text-sm font-medium mt-4 inline-flex items-center hover:underline"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Bespoke Tailoring →
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              <a 
                href="/heritage" 
                className="py-4 border-b border-gray-800 text-white text-lg flex justify-between items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Heritage <span className="text-gray-500">→</span>
              </a>
              <a 
                href="/atelier" 
                className="py-4 border-b border-gray-800 text-white text-lg flex justify-between items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact <span className="text-gray-500">→</span>
              </a>
              
              {/* Mobile Account Dropdown */}
              <div className="py-4 border-b border-gray-800">
                <button 
                  className="flex items-center justify-between w-full text-white text-lg"
                  onClick={() => setActiveCategory(activeCategory === -2 ? null : -2)}
                >
                  <span>Account</span>
                  <FiChevronDown className={`transition-transform ${activeCategory === -2 ? 'rotate-180' : ''}`} />
                </button>
                
                {activeCategory === -2 && (
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
                            <a
                              href={item.href}
                              className="text-gray-400 hover:text-white transition-colors text-sm py-1 block"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                item.action()
                                setMobileMenuOpen(false)
                              }}
                              className="text-gray-400 hover:text-white transition-colors text-sm py-1 block"
                            >
                              {item.label}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-12 flex gap-8 justify-center">
              {user ? (
                <>
                  <span className="text-gray-400 text-sm">Welcome, {user.name}</span>
                </>
              ) : (
                <>
                  <a href="/account/login" className="text-gray-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </a>
                  <a href="/account/register" className="text-gray-400 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}