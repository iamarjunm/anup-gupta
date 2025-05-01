'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const experiences = [
  {
    id: 1,
    title: "Bespoke Tailoring",
    description: "Each garment is handcrafted to your exact measurements by our master tailors with 30+ years of experience",
    image: "/bespoke.jpg",
    steps: [
      "Initial consultation",
      "Precision measurements",
      "Fabric selection",
      "3 fitting sessions",
      "Hand-finished details"
    ]
  },
  {
    id: 2,
    title: "Fabric Library",
    description: "Access our exclusive collection of 1000+ fabrics from the world's finest mills in England, Italy and Japan",
    image: "/fabrics.jpg",
    steps: [
      "Super 150s-200s wools",
      "Silk-cashmere blends",
      "Limited edition textiles",
      "Vintage fabric archive",
      "Climate-appropriate selections"
    ]
  },
  {
    id: 3,
    title: "Private Appointments",
    description: "Enjoy discreet 1:1 service in our Mayfair atelier or the comfort of your home/office",
    image: "/appointment.jpg",
    steps: [
      "Extended 2-hour sessions",
      "Champagne service",
      "Digital lookbook preview",
      "Style advisor consultation",
      "Worldwide concierge"
    ]
  }
]

export default function AtelierExperience() {
  const [activeTab, setActiveTab] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/atelier-bg.jpg"
          alt="Atelier background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-32 pb-20 text-center">
        <h2 className="text-5xl md:text-6xl font-serif font-light tracking-wider text-white">
          THE ATELIER EXPERIENCE
        </h2>
        <p className="mt-6 text-xl text-gold-500 font-light tracking-widest">
          Beyond Bespoke
        </p>
      </div>

      {/* Process Tabs */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex justify-center gap-6 mb-16">
          {experiences.map((exp, index) => (
            <button
              key={exp.id}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 text-sm uppercase tracking-widest transition-all 
                ${activeTab === index ? 'bg-white text-black' : 'border border-white/30 hover:border-white'}`}
            >
              {exp.title}
            </button>
          ))}
        </div>

        {/* Active Experience Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            key={experiences[activeTab].id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[500px] border border-white/20"
          >
            <Image
              src={experiences[activeTab].image}
              alt={experiences[activeTab].title}
              fill
              className="object-cover object-center"
            />
          </motion.div>

          <div>
            <h3 className="text-3xl font-serif mb-6 tracking-wider">
              {experiences[activeTab].title}
            </h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {experiences[activeTab].description}
            </p>
            <ul className="space-y-4">
              {experiences[activeTab].steps.map((step, i) => (
                <li key={i} className="flex items-start">
                  <span className="block mt-1 w-4 h-px bg-gold-500 mr-3"></span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Craftsmanship Highlights */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <h3 className="text-2xl font-serif text-center mb-16 tracking-wider">
          OUR CRAFTSMANSHIP PILLARS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hand Stitching",
              description: "Over 200 hours of handwork in each bespoke garment",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            },
            {
              title: "Millimeter Precision",
              description: "58 precise measurements for perfect fit",
              icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            },
            {
              title: "Lifetime Care",
              description: "Complimentary alterations and maintenance",
              icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-black/50 border border-white/10 p-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-gold-500/30">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-3">{item.title}</h4>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}