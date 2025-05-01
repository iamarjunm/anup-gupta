'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Authentication logic here
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex items-center justify-center">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/Tuxedo.jpg"
          alt="Login background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-sm border border-white/20 p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-wider mb-2">WELCOME BACK</h1>
          <div className="w-16 h-px bg-gold-500 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-white/30 py-3 px-1 focus:border-gold-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="form-checkbox bg-transparent border-white/30 rounded-sm" />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-gold-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ backgroundColor: '#ffffff', color: '#000000' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 border border-white text-white text-sm tracking-widest mt-8 disabled:opacity-50"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </motion.button>
        </form>

        <div className="text-center mt-8 text-sm">
          <p className="text-gray-400">
            New to our atelier?{' '}
            <Link href="/register" className="text-gold-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  )
}