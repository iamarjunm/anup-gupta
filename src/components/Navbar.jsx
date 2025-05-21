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
      title: "All",
      href: "/shop"
    },
    {
      title: "Tuxedo",
      href: "/shop?category=tuxedo"
    },
    {
      title: "Suits",
      href: "/shop?category=suits"
    },
    {
      title: "Sherwani",
      href: "/shop?category=sherwani"
    },
    {
      title: "Bandhgala",
      href: "/shop?category=bandhgala"
    },
    {
      title: "Nehru Jacket",
      href: "/shop?category=nehru-jacket"
    }
  ]

  // Profile items based on authentication status
  const profileItems = user
    ? [
        { label: "My Account", href: "/account" },
        { label: "Track Order", href: "/appointments" },
        { label: "Logout", action: () => handleLogout() }
      ]
    : [
        { label: "Login", href: "/account/login" },
        { label: "Register", href: "/account/register" }
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
                  >
                    <div className="w-56">
                      {categories.map((category, i) => (
                        <a
                          key={i}
                          href={category.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {category.title}
                        </a>
                      ))}
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
                        <a
                          key={i}
                          href={category.href}
                          className="block text-gray-400 hover:text-white transition-colors text-sm py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.title}
                        </a>
                      ))}
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