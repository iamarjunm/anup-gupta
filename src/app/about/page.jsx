'use client'
import { motion, useScroll } from 'framer-motion' // Removed useTransform as parallax is gone
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: "easeOut" }
  };

  const imageReveal = {
    initial: { opacity: 0, scale: 0.9, rotate: -2 }, // Subtle initial rotation
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 1, ease: "easeOut" }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* About Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 md:py-40">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 md:mb-32 border-b border-gray-800 pb-10" // Added subtle bottom border
        >
          <h1 className="text-4xl md:text-7xl font-serif font-normal tracking-tight mb-5 md:mb-8 text-shadow-md"> {/* Changed font-light to font-normal, tighter tracking */}
            THE ANUP GUPTA JOURNEY
          </h1>
          <div className="w-40 h-1 bg-yellow-500 mx-auto rounded-full"></div> {/* More prominent accent line */}
        </motion.div>

        {/* Section 1: Who is Anup Gupta? */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 md:mb-48 border-b border-gray-800 pb-10">
          {/* Text Block 1 */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-7 md:space-y-10 order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight leading-tight"> {/* Changed font-light to font-normal */}
              Who is Anup Gupta?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              <strong>Anup Gupta</strong>, a celebrated designer from Delhi, masterfully blends Indian tradition with global silhouettes. His creations are a vibrant reflection of bold elegance inspired by Bollywood style.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              With an ambitious vision to globalize Indian couture, he is actively taking it to the world stage. More than just fabric, his designs speak volumes of culture, celebration, and cinematic flair, embodying a unique sartorial narrative.
            </p>
          </motion.div>
          {/* Image 1: Anup Gupta */}
          <motion.div
            {...imageReveal}
            viewport={{ once: true }}
            className="relative h-[450px] md:h-[600px] shadow-xl rounded-xl overflow-hidden order-1 lg:order-2
                       transform-gpu hover:scale-103 transition-all duration-500 ease-out group" // Slightly less intense hover scale
          >
            <Image
              src="/anup-gupta-1.jpg"
              alt="Anup Gupta"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 transition-colors duration-300 rounded-xl"></div> {/* Refined border hover */}
          </motion.div>
        </div>

        {/* Section 2: Journey of 10 Years */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 md:mb-48 border-b border-gray-800 pb-10">
          {/* Image 2: Anup Gupta */}
          <motion.div
            {...imageReveal}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="relative h-[450px] md:h-[600px] shadow-xl rounded-xl overflow-hidden
                       transform-gpu hover:scale-103 transition-all duration-500 ease-out group" // Slightly less intense hover scale
          >
            <Image
              src="/anup-gupta-2.jpg"
              alt="Anup Gupta journey"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 transition-colors duration-300 rounded-xl"></div> {/* Refined border hover */}
          </motion.div>
          {/* Text Block 2 */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-7 md:space-y-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight leading-tight"> {/* Changed font-light to font-normal */}
              A Decade of Defining Luxury Fashion
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              With over a decade of rich experience in the luxury fashion industry, <strong>Anup Gupta's</strong> journey began by assisting his wife, a renowned designer, in founding 'Anoodhi', a luxury brand dedicated to women's ethnic and contemporary wear.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              During this period, he discovered a profound passion for menswear, which led him to launch his own distinguished label. His designs seamlessly blend traditional Indian aesthetics with a captivating Bollywood-inspired flair, creating truly unique pieces.
            </p>
          </motion.div>
        </div>

        {/* Section 3: Brand Overview - Anup Gupta Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 md:mb-48 border-b border-gray-800 pb-10">
          {/* Text Block 3 */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-7 md:space-y-10 order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight leading-tight"> {/* Changed font-light to font-normal */}
              Anup Gupta Studio: Bespoke Menswear with a Cinematic Charm
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Anup Gupta Studio specializes in crafting bespoke menswear, each piece infused with a distinctive Bollywood-inspired twist. We excel in designing exquisite sherwanis, sophisticated tuxedos, and other statement ethnic wear.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Our philosophy revolves around blending rich Indian tradition with modern sophistication. Every single design is a celebration of style, culture, and the enchanting allure of cinematic charm, meticulously created to stand out.
            </p>
          </motion.div>
          {/* Image 3: Anup Gupta Studio */}
          <motion.div
            {...imageReveal}
            viewport={{ once: true }}
            className="relative h-[450px] md:h-[600px] shadow-xl rounded-xl overflow-hidden order-1 lg:order-2
                       transform-gpu hover:scale-103 transition-all duration-500 ease-out group" // Slightly less intense hover scale
          >
            <Image
              src="/anup-gupta-3.jpg"
              alt="Anup Gupta Studio overview"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 transition-colors duration-300 rounded-xl"></div> {/* Refined border hover */}
          </motion.div>
        </div>

        {/* Section 4: Signature Collection with Image 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 md:mb-48 border-b border-gray-800 pb-10">
          {/* Image 4: Signature Collection */}
          <motion.div
            {...imageReveal}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="relative h-[450px] md:h-[600px] shadow-xl rounded-xl overflow-hidden
                       transform-gpu hover:scale-103 transition-all duration-500 ease-out group" // Slightly less intense hover scale
          >
            <Image
              src="/anup-gupta-4.jpg"
              alt="Anup Gupta Signature Collection"
              fill
              className="object-cover object-center border border-white/10"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 transition-colors duration-300 rounded-xl"></div> {/* Refined border hover */}
          </motion.div>
          {/* Text Block 4 */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-7 md:space-y-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight leading-tight"> {/* Changed font-light to font-normal */}
              Discover the Anup Gupta Signature Collection
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Our Signature Collection offers an exquisite range of menswear, meticulously designed for every discerning taste and occasion:
            </p>
            <ul className="list-disc list-inside text-lg md:text-xl text-gray-300 space-y-3 pl-4">
              <li>
                <strong>Tuxedo Collection:</strong> Featuring Black Tie, White Tie, Modern Slim, and Bespoke options for unparalleled formal elegance.
              </li>
              <li>
                <strong>Executive Suits:</strong> Crafted from premium Wool, available in Three-piece and Double-breasted designs for sophisticated professional wear.
              </li>
              <li>
                <strong>Sherwani Heritage:</strong> A tribute to tradition with Wedding, Silk, and intricately Embroidered sherwanis.
              </li>
              <li>
                <strong>Bandhgala Mastery:</strong> Showcasing modern Indian formal wear with refined Bandhgalas, Luxury Dress Shirts, and versatile Nehru Jackets.
              </li>
            </ul>
            <div className="pt-8 md:pt-10">
              <Link
                href="/shop"
                className="inline-block px-8 py-4 md:px-10 md:py-5 border-2 border-white text-white text-base tracking-widest uppercase rounded-md
                           transition-all duration-300 hover:bg-yellow-600 hover:text-black hover:border-yellow-600
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black" // Refined button hover and focus
              >
                EXPLORE OUR COLLECTIONS
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Craftsmanship Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }} // Adjusted delay
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 md:mt-32"
        >
          {[
            {
              title: "AUTHENTICITY IN CRAFT",
              description: "Our designs are deeply rooted in culture, going beyond mere fabric to tell a compelling story.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "RELATIONSHIPS OVER TRANSACTIONS",
              description: "We believe fashion is built on trust and genuine connection with our esteemed clientele.",
              icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            },
            {
              title: "GLOBAL VISION, LOCAL SOUL",
              description: "Taking the vibrant essence of India to the world stage, while upholding its unique spirit in every creation.",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }} // Slight adjustment in initial y
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Adjusted transition
              viewport={{ once: true }}
              className="border border-white/20 p-8 md:p-10 group hover:bg-white/5 transition-all duration-400 shadow-xl rounded-md
                         transform-gpu hover:-translate-y-1 hover:scale-101 relative overflow-hidden" // More subtle hover
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" /> {/* Subtler gold glow */}
              <div className="mb-6 md:mb-8 relative z-10">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 group-hover:text-yellow-300 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Slightly lighter yellow on hover */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h3 className="text-xl md:text-3xl font-serif mb-4 md:mb-5 tracking-wide relative z-10">{item.title}</h3>
              <p className="text-gray-300 text-base md:text-lg relative z-10">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}