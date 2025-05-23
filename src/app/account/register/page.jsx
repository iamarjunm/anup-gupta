'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { useUser } from '@/context/UserContext'
import Loader from '@/components/Loader'
import { loginCustomer } from '@/lib/auth'

export default function Register() {
  const router = useRouter()
  const { login } = useUser()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 1. Registration API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // 2. Immediately log the user in
      const result = await loginCustomer(formData.email, formData.password)

      if (result) {
        // Store token and expiration
        localStorage.setItem("shopifyAccessToken", result.token)
        localStorage.setItem("expiresAt", result.expiresAt)

        // 3. Fetch user data
        const userResponse = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${result.token}` }
        })
        
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await userResponse.json()
        
        // 4. Update user context
        login(result.token, userData)

        // 5. Redirect to account page
        router.push("/account")
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <h1 className="text-3xl font-serif font-light tracking-wider text-white mb-2">
            Join Our Atelier
          </h1>
          <p className="text-gray-400 mb-8">
            Create your privileged account for exclusive benefits and early access
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="First Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Minimum 8 characters with at least one number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 border-gray-800 rounded bg-black/30 text-gold-500 focus:ring-gold-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-gold-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gold-500 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center px-6 py-4 bg-gold-500 text-white rounded-lg hover:bg-gold-400 transition-all"
            >
              {isLoading ? (
                <Loader className="h-5 w-5" />
              ) : (
                <>
                  <span className="font-medium uppercase tracking-widest">Create Account</span>
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              Already have an account?{" "}
              <Link
                href="/account/login"
                className="font-medium text-gold-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:block lg:w-1/2 bg-black/90 relative">
        <div className="absolute inset-0 bg-[url('/luxury-pattern.png')] bg-repeat opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center max-w-md"
          >
            <h2 className="text-3xl font-serif font-light tracking-wider text-white mb-4">
              Exclusive Benefits
            </h2>
            <p className="text-gray-400 mb-8">
              Join our private clientele for personalized luxury experiences
            </p>
            <div className="flex justify-center">
              <div className="space-y-4 text-left">
                {[
                  "Early access to new arrivals",
                  "Exclusive member discounts",
                  "Personalized style recommendations",
                  "Faster checkout experience"
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center"
                  >
                    <div className="flex-shrink-0 bg-gold-500/10 p-1 rounded-full mr-3">
                      <CheckIcon className="h-4 w-4 text-gold-500" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  )
}