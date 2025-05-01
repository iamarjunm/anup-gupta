'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
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
    setIsLoading(true)
    // Registration logic here
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex items-center justify-center">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/Tuxedo2.JPG"
          alt="Register background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      {/* Register Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-sm border border-white/20 p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-wider mb-2">JOIN OUR ATELIER</h1>
          <p className="text-sm text-gray-400 mb-4">Create your privileged account</p>
          <div className="w-16 h-px bg-gold-500 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm uppercase tracking-widest mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm uppercase tracking-widest mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ backgroundColor: '#ffffff', color: '#000000' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 border border-white text-white text-sm tracking-widest mt-8 disabled:opacity-50"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </motion.button>
        </form>

        <div className="text-center mt-8 text-sm">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </motion.div>
    </section>
  )
}