'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/Tuxedo.jpg" // Replace with your preferred background image
          alt="Contact background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      {/* Contact Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 flex flex-col lg:flex-row items-start gap-16">
        {/* Contact Information - Left Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/3"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-8">
            CONTACT US
          </h2>
          
          <p className="text-lg text-gray-300 mb-12 leading-relaxed">
            For inquiries about our collections, bespoke services, or retail partnerships, 
            please reach out directly via the information below.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-1">OUR ATELIER</h4>
                <p className="text-gray-300">123 Savile Row, Mayfair</p>
                <p className="text-gray-300">London, W1S 3JE</p>
                <p className="text-gray-300">United Kingdom</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-1">EMAIL US</h4>
                <p className="text-gray-300">inquiries@elegance.com</p>
                <p className="text-gray-300">appointments@elegance.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-serif mb-1">CALL US</h4>
                <p className="text-gray-300">+44 20 7123 4567</p>
                <p className="text-gray-300">Mon-Fri: 9AM - 6PM GMT</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Empty Right Panel (removed form) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-2/3 bg-black/70 backdrop-blur-sm p-8 md:p-12 border border-white/20 flex items-center justify-center"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-light tracking-wider mb-4">
              CONTACT VIA EMAIL
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Please direct all inquiries to our email addresses listed.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">General inquiries: <span className="text-white">inquiries@elegance.com</span></p>
              <p className="text-gray-300">Appointments: <span className="text-white">appointments@elegance.com</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}