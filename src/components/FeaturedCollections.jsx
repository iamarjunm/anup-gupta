'use client'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link' // Import Link from Next.js

const collections = [
  {
    id: 1,
    title: "TUXEDO COLLECTION",
    subtitle: "Black tie elegance perfected",
    image: "/Tuxedo.jpg",
    cta: "Explore Tuxedos",
    link: "/shop?category=tuxedo", // Added link
    items: ["Black Tie", "White Tie", "Modern Slim", "Bespoke"]
  },
  {
    id: 2,
    title: "EXECUTIVE SUITS",
    subtitle: "Power dressing redefined",
    image: "/Tuxedo2.JPG",
    cta: "View Suits",
    link: "/shop?category=suits", // Added link
    items: ["Wool Collection", "Three-Piece", "Double-Breasted", "Custom Fit"]
  },
  {
    id: 3,
    title: "SHERWANI HERITAGE",
    subtitle: "Regal craftsmanship for modern royalty",
    image: '/Sherwani.JPG',
    cta: "Discover Sherwanis",
    link: "/shop?category=sherwani", // Added link
    items: ["Wedding", "Embroidered", "Silk", "Contemporary"]
  },
  {
    id: 4,
    title: "BANDHGALA MASTERY",
    subtitle: "Timeless Indian formalwear",
    image: "/Bandhgala.JPG",
    cta: "Explore Bandhgalas",
    link: "/shop?category=bandhgala", // Added link
    items: ["Jodhpuri", "Silk", "Embroidered", "Contemporary"]
  },
  {
    id: 5,
    title: "LUXURY DRESS SHIRTS",
    subtitle: "The foundation of impeccable style",
    image: "/Shirt.JPG",
    cta: "Browse Shirts",
    link: "/shop?category=shirts", // Added link
    items: ["French Cuff", "Spread Collar", "Tuxedo", "Custom"]
  },
  {
    id: 6,
    title: "NEHRU JACKETS",
    subtitle: "Contemporary elegance with tradition",
    image: "/nehru-jacket-2.jpg",
    cta: "View Jackets",
    link: "/shop?category=nehru-jacket", // Added link
    items: ["Classic Black", "Jacquard", "Evening", "Silk"]
  }
]

export default function FeaturedCollections() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const yText = useTransform(scrollYProgress, [0, 0.5], ["40%", "0%"])

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Dark Background */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 bg-black z-0"
      >
        <Image
          src="/luxury-fabric-texture.jpg"
          alt="Luxury background"
          fill
          className="object-cover opacity-10"
          quality={100}
        />
      </motion.div>

      {/* Section Header */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 pt-40 pb-24 text-center"
      >
        <p className="text-gold-500 text-sm uppercase tracking-[0.3em] mb-4">
          Signature Collections
        </p>

        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-tight text-white mb-6">
          CURATED ELEGANCE
        </h2>

        <p className="text-white/80 text-lg font-light tracking-wide max-w-2xl mx-auto">
          Our most coveted designs, handcrafted with uncompromising attention to detail
        </p>
      </motion.div>

      {/* Collections Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            className="group relative h-[600px] overflow-hidden"
            onMouseEnter={() => setHoveredCard(collection.id)}
            onMouseLeave={() => setHoveredCard(null)}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: collection.id * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Image */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{
                scale: hoveredCard === collection.id ? 1.05 : 1
              }}
              transition={{ duration: 0.6 }}
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

            {/* Content */}
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

              {/* Items list */}
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

              {/* CTA button */}
              <Link href={collection.link}>
                <motion.button
                  animate={{
                    y: hoveredCard === collection.id ? 0 : 25,
                    opacity: hoveredCard === collection.id ? 1 : 0
                  }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="px-6 py-3 bg-white text-black font-medium text-sm tracking-wider hover:bg-gold-500 transition-all"
                >
                  {collection.cta}
                </motion.button>
              </Link>
            </div>

            {/* Hover glow effect */}
            {hoveredCard === collection.id && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                style={{
                  background: `radial-gradient(circle at center, rgba(212, 175, 55, 0.2), transparent 70%)`
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="relative z-20 text-center pb-40">
        <Link href="/shop"> {/* Link for "EXPLORE ALL COLLECTIONS" */}
          <motion.button
            whileHover={{
              backgroundColor: "#D4AF37",
              color: "#000",
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="px-12 py-4 bg-black border border-gold-500 text-gold-500 text-sm tracking-widest uppercase hover:bg-gold-500 hover:text-black transition-all"
          >
            EXPLORE ALL COLLECTIONS
          </motion.button>
        </Link>
      </div>
    </section>
  )
}