'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const heroSlides = [
  {
    image: '/Tuxedo.jpg',
    title: "TUXEDO COLLECTION",
    subtitle: "Black tie elegance perfected",
    cta: "Explore Tuxedos",
    link: "/shop?category=tuxedo" // Add a link for the CTA
  },
  {
    image: '/Tuxedo2.JPG',
    title: "EXECUTIVE SUITS",
    subtitle: "Power dressing redefined",
    cta: "View Suits",
    link: "/shop?category=suits"
  },
  {
    image: '/Sherwani.JPG',
    title: "SHERWANI HERITAGE",
    subtitle: "Regal craftsmanship for modern royalty",
    cta: "Discover Sherwanis",
    link: "/shop?category=sherwani"
  },
  {
    // Placeholder image for Shirts - ideally replace with a high-quality product shot
    image: "/Shirt.JPG",    
    title: "LUXURY SHIRTING",
    subtitle: "The foundation of a flawless ensemble",
    cta: "Shop Shirts",
    link: "/shop?category=shirts"
  },
  {
    // Placeholder image for Bandhgalas - ideally replace with a high-quality product shot
    image: '/Bandhgala.JPG',
    title: "BANDHGALA IMPERIAL",
    subtitle: "Distinctive heritage, refined for the modern connoisseur",
    cta: "Explore Bandhgalas",
    link: "/shop?category=bandhgala"
  },
  {
    image: '/nehru-jacket-1.jpg',
    title: "NEHRU JACKETS",
    subtitle: "Contemporary elegance with tradition",
    cta: "Browse Jackets",
    link: "/shop?category=nehru-jacket"
  }
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef(null)

  // Auto-advance with elegant timing
  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
      }
    }, 7000) // Premium 7-second interval

    return () => resetTimeout()
  }, [currentIndex, isHovered])

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
  }

  const goToPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  // Runway-style animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.8 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  }

  return (
    <section 
      className="relative w-full h-screen -mt-[88px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Runway Background Slides */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={heroSlides[currentIndex].image}
              alt={heroSlides[currentIndex].title}
              fill
              priority
              quality={100}
              className="object-cover object-center"
            />
            {/* Luxury Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content - Fashion Show Typography */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-wider mb-6">
              <span className="block text-white">{heroSlides[currentIndex].title}</span>
              <span className="block text-white text-2xl md:text-3xl font-light mt-4">
                {heroSlides[currentIndex].subtitle}
              </span>
            </h1>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="mt-12 flex gap-6 justify-center"
            >
              <Link href={heroSlides[currentIndex].link}>
                <button className="px-8 py-4 bg-white text-black font-medium rounded-sm hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  {heroSlides[currentIndex].cta}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Luxury Navigation Arrows */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex gap-8">
        <motion.button
          onClick={goToPrev}
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(0,0,0,0.3)' }}
          whileTap={{ scale: 0.9 }}
          className="text-white text-2xl p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
        <motion.button
          onClick={goToNext}
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(0,0,0,0.3)' }}
          whileTap={{ scale: 0.9 }}
          className="text-white text-2xl p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Runway Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        {heroSlides.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className="h-1 cursor-pointer"
            initial={{ width: 20, backgroundColor: 'rgba(255,255,255,0.5)' }}
            animate={{ 
              width: index === currentIndex ? 40 : 20,
              backgroundColor: index === currentIndex ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)'
            }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        ))}
      </div>


      {/* Micro-Interaction Hover Indicator */}
      {isHovered && (
        <motion.div 
          className="absolute left-1/2 bottom-4 transform -translate-x-1/2 z-20 text-white/50 text-xs tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          ← SWIPE →
        </motion.div>
      )}
    </section>
  )
}