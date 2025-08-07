'use client'
import { motion } from "framer-motion";

export default function CompanyBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full bg-black py-16 overflow-hidden"
    >
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
      </div>
      
      {/* Animated Border */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-[0.3em] text-white mb-6">
            ANUP GUPTA STUDIO
          </h2>
          <p className="text-sm md:text-base font-light tracking-[0.2em] text-gray-300 uppercase">
            A Unit of Vijay and Ajay Marketing Private Limited
          </p>
        </motion.div>
        
        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex justify-center items-center gap-8 mt-12"
        >
          <div className="w-12 h-px bg-white/30"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-12 h-px bg-white/30"></div>
        </motion.div>
      </div>
    </motion.section>
  );
} 