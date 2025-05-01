'use client'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const editorials = [
  {
    id: 1,
    title: "The Modern Tuxedo",
    subtitle: "Reimagining black tie for a new generation",
    image: "https://picsum.photos/id/1005/1600/2400",
    category: "Tuxedos",
    cta: "View Collection",
    tags: ["Black Tie", "Formal", "Evening Wear"]
  },
  {
    id: 2,
    title: "Power Suiting",
    subtitle: "Commanding presence through tailoring",
    image: "https://picsum.photos/id/1027/1600/2400",
    category: "Suits",
    cta: "Explore Suits",
    tags: ["Executive", "Wool", "Custom Fit"]
  },
  {
    id: 3,
    title: "Regal Heritage",
    subtitle: "Sherwanis with contemporary elegance",
    image: "https://picsum.photos/id/1035/1600/2400",
    category: "Sherwanis",
    cta: "Discover",
    tags: ["Wedding", "Embroidered", "Silk"]
  },
  {
    id: 4,
    title: "Nehru Jackets",
    subtitle: "Where minimalism meets tradition",
    image: "https://picsum.photos/id/1043/1600/2400",
    category: "Jackets",
    cta: "Browse",
    tags: ["Bandhgala", "Evening", "Jacquard"]
  },
  {
    id: 5,
    title: "Evening Formals",
    subtitle: "For the most discerning gentlemen",
    image: "https://picsum.photos/id/1050/1600/2400",
    category: "Black Tie",
    cta: "View Lookbook",
    tags: ["White Tie", "Tails", "Bespoke"]
  },
  {
    id: 6,
    title: "Contemporary Classics",
    subtitle: "Timeless silhouettes, modern details",
    image: "https://picsum.photos/id/1068/1600/2400",
    category: "Tailoring",
    cta: "See More",
    tags: ["Double-Breasted", "Three-Piece", "Slim Fit"]
  }
]

export default function EditorialLookbook() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Parallax & fade effects
  const yText = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const scaleBg = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])

  return (
    <section 
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Background texture */}
      <motion.div 
        style={{ scale: scaleBg }}
        className="absolute inset-0 opacity-10"
      >
        <Image
          src="https://picsum.photos/id/1069/1920/1080"
          alt="Texture"
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
          SIGNATURE STYLES
        </h2>
        <p className="mt-6 text-xl text-gold-500 font-light tracking-widest">
          Editorial Lookbook
        </p>
      </motion.div>

      {/* Editorial Grid - Masonry Layout */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {editorials.map((editorial) => (
            <motion.div
              key={editorial.id}
              className="relative break-inside-avoid group"
              onMouseEnter={() => setHoveredCard(editorial.id)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: editorial.id * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Image with hover zoom */}
              <motion.div
                className="relative overflow-hidden"
                animate={{
                  scale: hoveredCard === editorial.id ? 1.03 : 1
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={editorial.image}
                  alt={editorial.title}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </motion.div>

              {/* Editorial Info - Overlay */}
              <motion.div
                className="absolute bottom-0 left-0 w-full p-6 text-white"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredCard === editorial.id ? 1 : 0.9,
                  y: hoveredCard === editorial.id ? 0 : 20
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-2 text-sm uppercase tracking-widest text-gold-500">
                  {editorial.category}
                </div>
                <h3 className="text-2xl font-serif mb-2 tracking-wider">
                  {editorial.title}
                </h3>
                <p className="text-white/80 mb-4">
                  {editorial.subtitle}
                </p>

                {/* Tags */}
                <motion.div
                  className="flex flex-wrap gap-2 mb-4"
                  animate={{
                    opacity: hoveredCard === editorial.id ? 1 : 0,
                    y: hoveredCard === editorial.id ? 0 : 10
                  }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {editorial.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 text-xs bg-black/50 backdrop-blur-sm border border-white/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  animate={{
                    opacity: hoveredCard === editorial.id ? 1 : 0,
                    y: hoveredCard === editorial.id ? 0 : 15
                  }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Link 
                    href="#"
                    className="inline-block px-6 py-2 text-sm border border-white hover:bg-white hover:text-black transition-all"
                  >
                    {editorial.cta}
                  </Link>
                </motion.div>
              </motion.div>

              {/* Magazine-style border */}
              <motion.div
                className="absolute inset-0 border border-white/10 pointer-events-none"
                animate={{
                  opacity: hoveredCard === editorial.id ? 0.8 : 0.3
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="relative z-20 text-center pb-32">
        <motion.button
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "#fff",
            color: "#000"
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 border border-white text-white text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          VIEW FULL LOOKBOOK
        </motion.button>
      </div>
    </section>
  )
}