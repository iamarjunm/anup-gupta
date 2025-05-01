'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Sample product data structure
  const defaultProduct = {
    id: 1,
    name: "Royal Midnight Tuxedo",
    price: "£1,895",
    originalPrice: "£2,450",
    image: "https://picsum.photos/id/1005/800/1200",
    secondaryImage: "https://picsum.photos/id/1018/800/1200",
    category: "Tuxedos",
    details: "Hand-stitched peak lapel • Super 150s wool • Horn buttons",
    colors: ["#000000", "#1A1A1A", "#2B2B2B"],
    isNew: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 42
  }

  const data = product || defaultProduct

  return (
    <motion.div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setSelectedColor(null)
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {data.isNew && (
          <span className="px-3 py-1 text-xs bg-white text-black uppercase tracking-wider">
            New
          </span>
        )}
        {data.isBestSeller && (
          <span className="px-3 py-1 text-xs bg-gold-500 text-black uppercase tracking-wider">
            Bestseller
          </span>
        )}
      </div>

      {/* Quick View Button */}
      <motion.button
        className="absolute top-4 right-4 z-10 p-2 bg-white text-black rounded-full shadow-lg"
        onClick={() => setIsQuickViewOpen(true)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -10
        }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </motion.button>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        {/* Main Image */}
        <motion.div
          animate={{
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.4 }}
          className="aspect-[3/4] relative"
        >
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Secondary Image (appears on hover) */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 1.05
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 aspect-[3/4]"
        >
          <Image
            src={data.secondaryImage}
            alt={data.name + " alternate view"}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Add to Cart Button (slides up on hover) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full p-4 z-10"
          animate={{
            y: isHovered ? 0 : 50,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <button className="w-full py-3 bg-black text-white text-sm tracking-wider hover:bg-gray-900 transition-all">
            ADD TO CART
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{data.category}</p>
            <h3 className="text-lg font-serif mt-1">{data.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg">{data.price}</p>
            {data.originalPrice && (
              <p className="text-sm text-gray-500 line-through">{data.originalPrice}</p>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <motion.div
          className="flex gap-2 mt-3"
          animate={{
            opacity: isHovered ? 1 : 0.7
          }}
        >
          {data.colors.map((color, i) => (
            <button
              key={i}
              className={`w-5 h-5 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedColor(color)
              }}
            />
          ))}
        </motion.div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(data.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({data.reviewCount})
          </span>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Quick View Content */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square">
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <button 
                    className="absolute top-4 right-4 p-2"
                    onClick={() => setIsQuickViewOpen(false)}
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl font-serif">{data.name}</h2>
                  <p className="text-lg mt-2">{data.price}</p>
                  <p className="text-sm text-gray-500 mt-4">{data.details}</p>
                  
                  <div className="mt-6">
                    <h3 className="text-sm uppercase tracking-wider">Color</h3>
                    <div className="flex gap-2 mt-2">
                      {data.colors.map((color, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-200'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-8 py-3 bg-black text-white hover:bg-gray-900 transition-all">
                    ADD TO CART — {data.price}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}