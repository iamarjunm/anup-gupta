'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function LuxuryFooter() {
  const [hoveredLink, setHoveredLink] = useState(null)
  const [email, setEmail] = useState('')

  const footerLinks = [
    {
      title: 'Collections',
      links: [
        { name: 'Tuxedo Collection', href: '/shop?category=tuxedo' },
        { name: 'Executive Suits', href: '/shop?category=suits' },
        { name: 'Sherwani Heritage', href: '/shop?category=sherwani' },
        { name: 'Nehru Jackets', href: '/shop?category=nehru-jacket' },
        { name: 'Bandhgala', href: '/shop?category=bandhgala' },
        { name: 'Shirts', href: '//shop?category=shirts' },
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Our Heritage', href: '/about' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'LinkedIn', href: 'https://linkedin.com' },
  ]

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-20">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-1"
          >
            <h3 className="text-xl font-serif mb-6 tracking-wider">CONTACT</h3>
            <address className="not-italic space-y-4">
              <p className="text-white/70 hover:text-white transition-colors">
                647-926-9903
              </p>
              <p className="text-white/70 hover:text-white transition-colors">
                info@anupguptastudio.com
              </p>
            </address>
            
            {/* Opening Hours */}
            <div className="mt-8">
              <h4 className="text-sm uppercase tracking-wider mb-2">Hours</h4>
              <p className="text-white/70 text-sm">
                Monday to Friday: 10AM - 6PM<br />
                Saturday: 11AM - 5PM<br />
                Sunday: Closed
              </p>
            </div>
          </motion.div>

          {/* Quick Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-serif mb-6 tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li 
                    key={link.name}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Link 
                      href={link.href}
                      className="group flex items-start text-white/70 hover:text-white transition-colors"
                    >
                      <motion.span
                        animate={{
                          opacity: hoveredLink === link.name ? 1 : 0,
                          width: hoveredLink === link.name ? '12px' : '0px'
                        }}
                        className="block h-px bg-white mt-3 mr-2"
                      />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-xl font-serif mb-6 tracking-wider">NEWSLETTER</h3>
            <p className="text-white/70 mb-6">
              Subscribe for exclusive previews, private events, and bespoke offerings.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-white/30 py-2 px-1 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-4 px-6 py-3 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all"
              >
                SUBSCRIBE
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="h-px bg-white/10 w-full my-10 origin-left"
        />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center">

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex space-x-6 text-sm"
          >
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white/30 text-xs mt-10"
        >
          © {new Date().getFullYear()} Anup Gupta Studio. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}