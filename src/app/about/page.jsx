'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/Tuxedo.jpg" // Replace with your preferred about page background
          alt="About background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* About Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        {/* Centered Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-light tracking-wider mb-6">
            ELEGANCE REDEFINED
          </h1>
          <div className="w-24 h-px bg-gold-500 mx-auto"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[600px]"
          >
            <Image
              src="/Tuxedo2.JPG" // Replace with your brand image
              alt="Master Tailor"
              fill
              className="object-cover object-center border border-white/20"
            />
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wider">
              THE ESSENCE OF TIMELESS STYLE
            </h2>
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                Our garments embody the perfect harmony between traditional craftsmanship and contemporary design. 
                Each piece is a testament to sartorial excellence, crafted with meticulous attention to detail.
              </p>
              
              <p>
                We source only the finest fabrics from renowned mills around the world, ensuring every creation 
                meets our exacting standards of quality and comfort. The result is clothing that doesn't just 
                adorn the body, but elevates the wearer.
              </p>
              
              <p>
                From the precise drape of our tuxedos to the impeccable cut of our suits, every stitch reflects 
                our commitment to uncompromising quality. These are not merely clothes—they are heirloom pieces 
                designed to transcend seasons and trends.
              </p>
            </div>
            
            <div className="pt-8">
              <motion.button
                whileHover={{ backgroundColor: '#ffffff', color: '#000000' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-white text-white text-sm tracking-widest"
              >
                EXPLORE OUR CRAFTSMANSHIP
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Craftsmanship Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
        >
          {[
            {
              title: "BESPOKE TAILORING",
              description: "Each garment meticulously crafted to your exact measurements",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "LUXURY FABRICS",
              description: "Sourced from the world's most prestigious mills and ateliers",
              icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            },
            {
              title: "TIMELESS DESIGN",
              description: "Styles that transcend seasons and remain eternally elegant",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          ].map((item, index) => (
            <div key={index} className="border border-white/20 p-8 group hover:bg-white/5 transition-all duration-500">
              <div className="mb-6">
                <svg className="w-8 h-8 text-gold-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-4">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}