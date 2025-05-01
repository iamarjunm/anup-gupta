'use client'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const collections = [
  {
    id: 1,
    title: "TUXEDO COLLECTION",
    subtitle: "Black tie elegance perfected",
    image: "/Tuxedo.jpg",
    cta: "Explore Tuxedos",
    items: ["Black Tie", "White Tie", "Modern Slim", "Bespoke"]
  },
  {
    id: 2,
    title: "EXECUTIVE SUITS",
    subtitle: "Power dressing redefined",
    image: "/Tuxedo2.JPG",
    cta: "View Suits",
    items: ["Wool Collection", "Three-Piece", "Double-Breasted", "Custom Fit"]
  },
  {
    id: 3,
    title: "SHERWANI HERITAGE",
    subtitle: "Regal craftsmanship for modern royalty",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    cta: "Discover Sherwanis",
    items: ["Wedding", "Embroidered", "Silk", "Contemporary"]
  },
  {
    id: 4,
    title: "NEHRU JACKETS",
    subtitle: "Contemporary elegance with tradition",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    cta: "Browse Jackets",
    items: ["Classic Black", "Jacquard", "Bandhgala", "Evening"]
  }
]

export default function FeaturedCollections() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Seamless background transition from hero
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const yText = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"])

  return (
    <section 
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Transition Background */}
      <motion.div 
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 bg-black z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70" />
      </motion.div>

      {/* Seamless Title Animation */}
      <motion.div 
        style={{ y: yText }}
        className="relative z-10 pt-32 pb-20 text-center"
      >
        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-wider text-white">
          CURATED COLLECTIONS
        </h2>
        <p className="mt-6 text-xl text-gold-500 font-light tracking-widest">
          Explore our signature lines
        </p>
      </motion.div>

      {/* Collections Grid with Hero Continuity */}
      <div className="relative z-10 container mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            className="group relative h-[600px] overflow-hidden"
            onMouseEnter={() => setHoveredCard(collection.id)}
            onMouseLeave={() => setHoveredCard(null)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: collection.id * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Hero-style image treatment */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{
                scale: hoveredCard === collection.id ? 1.03 : 1
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </motion.div>

            {/* Consistent typography with Hero */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
              <motion.h3
                animate={{
                  y: hoveredCard === collection.id ? 0 : 10
                }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-serif mb-2 tracking-wider"
              >
                {collection.title}
              </motion.h3>
              <motion.p
                animate={{
                  y: hoveredCard === collection.id ? 0 : 15,
                  opacity: hoveredCard === collection.id ? 1 : 0.9
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-gold-500 mb-4 text-lg"
              >
                {collection.subtitle}
              </motion.p>

              {/* Subtle items list */}
              <motion.div
                animate={{
                  y: hoveredCard === collection.id ? 0 : 20,
                  opacity: hoveredCard === collection.id ? 1 : 0
                }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-6"
              >
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {collection.items.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="block w-2 h-px bg-gold-500 mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Matching CTA button */}
              <motion.button
                animate={{
                  y: hoveredCard === collection.id ? 0 : 25,
                  opacity: hoveredCard === collection.id ? 1 : 0
                }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="px-6 py-3 bg-white text-black font-medium text-sm tracking-wider hover:bg-gray-100 transition-all"
              >
                {collection.cta}
              </motion.button>
            </div>

            {/* Hero-style border */}
            <motion.div
              className="absolute inset-0 border border-white/20"
              animate={{
                opacity: hoveredCard === collection.id ? 0.8 : 0.3
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Consistent CTA styling */}
      <div className="relative z-20 text-center pb-32">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 border border-white text-white text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          VIEW ALL COLLECTIONS
        </motion.button>
      </div>
    </section>
  )
}