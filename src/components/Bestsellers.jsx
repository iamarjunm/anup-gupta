'use client'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const bestsellers = [
  {
    id: 1,
    name: "Royal Midnight Tuxedo",
    price: "£1,895",
    image: "https://picsum.photos/id/1005/800/1200",
    category: "Tuxedos",
    details: "Hand-stitched peak lapel • Super 150s wool • Horn buttons",
    colors: ["#000000", "#1A1A1A", "#2B2B2B"]
  },
  {
    id: 2,
    name: "Savile Row Executive Suit",
    price: "£2,450",
    image: "https://picsum.photos/id/1027/800/1200",
    category: "Suits",
    details: "Full canvas construction • Italian cashmere • Dual vents",
    colors: ["#2D3748", "#4A5568", "#718096"]
  },
  {
    id: 3,
    name: "Heritage Silk Sherwani",
    price: "£3,200",
    image: "https://picsum.photos/id/1035/800/1200",
    category: "Sherwanis",
    details: "Hand-embroidered • Pure mulberry silk • Custom motifs",
    colors: ["#5C2D0A", "#7F4A24", "#A06A42"]
  },
  {
    id: 4,
    name: "Nehru Bandhgala Jacket",
    price: "£1,150",
    image: "https://picsum.photos/id/1043/800/1200",
    category: "Jackets",
    details: "Mandarin collar • Jacquard lining • Mother-of-pearl buttons",
    colors: ["#1E293B", "#334155", "#475569"]
  }
]

export default function BestsellersCollection() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const yText = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const scaleBg = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])

  return (
    <section 
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Luxury texture background */}
      <motion.div 
        style={{ scale: scaleBg }}
        className="absolute inset-0 opacity-5"
      >
        <Image
          src="https://picsum.photos/id/1060/1920/1080"
          alt="Luxury texture"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Section Header */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 pt-32 pb-20 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-serif font-light tracking-wider text-white">
          CURATED BESTSELLERS
        </h2>
        <p className="mt-6 text-xl text-gold-500 font-light tracking-widest">
          Most coveted by our clients
        </p>
      </motion.div>

      {/* Bestsellers Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {bestsellers.map((item) => (
          <motion.div
            key={item.id}
            className="group relative"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => {
              setHoveredItem(null)
              setSelectedColor(null)
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: item.id * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Product Image with hover effect */}
            <motion.div
              className="relative overflow-hidden"
              animate={{
                scale: hoveredItem === item.id ? 1.03 : 1
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={800}
                height={1200}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Quick View Button */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{
                  opacity: hoveredItem === item.id ? 1 : 0,
                  y: hoveredItem === item.id ? 0 : 20
                }}
                transition={{ duration: 0.3 }}
              >
                <button className="p-2 bg-white text-black rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </motion.div>
            </motion.div>

            {/* Product Info */}
            <div className="mt-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70 uppercase tracking-wider">{item.category}</p>
                  <h3 className="text-xl font-serif mt-1">{item.name}</h3>
                </div>
                <p className="text-lg font-light">{item.price}</p>
              </div>

              {/* Color Swatches */}
              <motion.div
                className="flex gap-2 mt-3"
                animate={{
                  opacity: hoveredItem === item.id ? 1 : 0.7,
                  y: hoveredItem === item.id ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
              >
                {item.colors.map((color, i) => (
                  <button
                    key={i}
                    className={`w-5 h-5 rounded-full border ${selectedColor === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedColor(color)
                    }}
                  />
                ))}
              </motion.div>

              {/* Product Details - Appears on hover */}
              <motion.div
                className="mt-3"
                animate={{
                  opacity: hoveredItem === item.id ? 1 : 0,
                  height: hoveredItem === item.id ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-white/80">{item.details}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-2 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all"
                >
                  ADD TO CART
                </motion.button>
              </motion.div>
            </div>

            {/* Luxury border */}
            <motion.div
              className="absolute inset-0 border border-white/10 pointer-events-none"
              animate={{
                opacity: hoveredItem === item.id ? 0.8 : 0.3
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="relative z-20 text-center pb-32">
        <Link href="/shop">
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#fff",
              color: "#000"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-white text-white text-sm tracking-widest hover:bg-white hover:text-black transition-all"
          >
            EXPLORE ALL BESTSELLERS
          </motion.button>
        </Link>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              x: useTransform(scrollYProgress, [0, 1], [0, Math.random() * 100 - 50]),
              y: useTransform(scrollYProgress, [0, 1], [0, Math.random() * 100 - 50]),
            }}
          />
        ))}
      </div>
    </section>
  )
}