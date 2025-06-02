'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const imageReveal = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src="/tuxedo-bg.jpg" // Replace with your preferred about page background image
          alt="Luxury fashion background texture"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
      </div>

      {/* About Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wider mb-4 md:mb-6">
            THE ANUP GUPTA JOURNEY
          </h1>
          <div className="w-28 h-px bg-yellow-500 mx-auto"></div>
        </motion.div>

        {/* Section 1: Introduction and Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-36">
          {/* Text Block 1 */}
          <motion.div
            {...fadeIn}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-wider leading-tight">
              Crafting Legacies, Defining Modern Indian Menswear
            </h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Anup Gupta embarked on his visionary journey in 2011, establishing a brand that would redefine men's fashion. His ethos was clear: to blend the rich tapestry of traditional Indian craftsmanship with the clean lines and sophisticated appeal of contemporary design. Each creation isn't just an outfit; it's a testament to a timeless legacy, meticulously crafted with passion and precision.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              From our vibrant atelier in India, a dedicated collective of master tailors, artistic hand-painters, and innovative designers converge. This synergy ensures that every stitch, every brushstroke, contributes to a garment of unparalleled quality and distinctive character. We believe in clothing that empowers, tells a story, and stands the test of time.
            </p>
          </motion.div>
          {/* Image 1: Anup Gupta in his element (e.g., sketching, overseeing work) */}
          <motion.div
            {...imageReveal}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] shadow-xl order-1 lg:order-2"
          >
            <Image
              src="/anup-gupta-1.jpg" // Replace with image 1 of Anup Gupta (e.g., at work, focused)
              alt="Anup Gupta sketching designs"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Section 2: Global Reach and Specializations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-36">
          {/* Image 2: Anup Gupta with models/showcasing an outfit */}
          <motion.div
            {...imageReveal}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] shadow-xl"
          >
            <Image
              src="/anup-gupta-2.jpg" // Replace with image 2 of Anup Gupta (e.g., at a show or fitting)
              alt="Anup Gupta showcasing a design"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          {/* Text Block 2 */}
          <motion.div
            {...fadeIn}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-wider leading-tight">
              From Delhi NCR to International Acclaim
            </h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              While deeply rooted and celebrated across the Delhi NCR region for our impeccable quality and distinctive designs, Anup Gupta's influence has gracefully expanded. Our elegant menswear now adorns discerning clientele across Canada and the USA, a true testament to the universal appeal of bespoke craftsmanship and authentic Indian luxury.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              We specialize in crafting exceptionally tailored pieces, from the sharp lines of our tuxedos to the regal elegance of our Nehru jackets. Our extensive repertoire also includes a diverse range of traditional outfits, each meticulously designed to embody modern sophistication while respecting cultural heritage. We are dedicated to delivering unparalleled sartorial excellence to every customer.
            </p>
          </motion.div>
        </div>

        {/* Section 3: Artisan Painted Shirts & Commitment to Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-36">
          {/* Text Block 3 */}
          <motion.div
            {...fadeIn}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-wider leading-tight">
              The Art of Wear: Our Artisan-Painted Collection
            </h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Innovation is at the core of our brand, exemplified by our unique collection of artisan-painted shirts. Each shirt is a canvas, where pure colors are meticulously applied by hand, transforming fabric into a vibrant masterpiece. This collection represents a beautiful fusion of fashion and fine art, offering garments that are not just attractive, but possess a truly captivating grace.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Our commitment to quality extends to every thread. We meticulously source the finest fabrics and employ traditional techniques alongside contemporary tailoring methods to ensure durability, comfort, and an impeccable finish. Every piece from Anup Gupta is designed to be cherished, an heirloom in the making.
            </p>
            <div className="pt-6 md:pt-8">
              <motion.button
                whileHover={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ffffff' }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 md:px-8 md:py-4 border border-white text-white text-sm tracking-widest uppercase transition-colors duration-300"
              >
                EXPLORE OUR COLLECTIONS
              </motion.button>
            </div>
          </motion.div>
          {/* Image 3: Anup Gupta (e.g., close-up, or interacting with a hand-painted shirt) */}
          <motion.div
            {...imageReveal}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] shadow-xl order-1 lg:order-2"
          >
            <Image
              src="/anup-gupta-4.jpg" // Replace with image 3 of Anup Gupta (e.g., focusing on detail or hand-painting)
              alt="Anup Gupta inspecting craftsmanship"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Craftsmanship Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 md:mt-32"
        >
          {[
            {
              title: "BESPOKE TAILORING",
              description: "Each garment is meticulously crafted to your exact measurements, ensuring a flawless and personalized fit.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z" // SVG path for an icon
            },
            {
              title: "LUXURY FABRICS",
              description: "We source only the finest fabrics from the world's most prestigious mills, embodying comfort and unparalleled quality.",
              icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" // SVG path for an icon
            },
            {
              title: "TIMELESS DESIGN",
              description: "Our styles transcend fleeting trends, ensuring enduring elegance and sophistication that remains eternally fashionable.",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // SVG path for an icon
            }
          ].map((item, index) => (
            <div key={index} className="border border-white/20 p-6 md:p-8 group hover:bg-white/5 transition-all duration-500 shadow-xl">
              <div className="mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-serif mb-3 md:mb-4">{item.title}</h3>
              <p className="text-gray-300 text-sm md:text-base">{item.description}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}