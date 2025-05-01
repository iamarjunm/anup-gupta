'use client'
import { useEffect, useState } from 'react'
import { FaGlobe, FaTruck } from 'react-icons/fa'

export default function Banner() {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const banner = document.getElementById('banner')
      const bannerTop = banner.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (bannerTop <= windowHeight) {
        setInView(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="banner"
      className={`relative w-full bg-black text-white py-6 px-16 mt-12 transition-all duration-500 ease-in-out transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-1/2">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-3xl text-yellow-400" />
            <h2 className="text-xl font-semibold">Shipping Worldwide</h2>
          </div>
          <p className="text-lg font-light">Free shipping for orders above $100</p>
          <ul className="text-lg font-light space-y-2">
            <li className="flex items-center gap-2">
              <FaTruck className="text-yellow-400" /> Fast & Reliable Delivery
            </li>
            <li className="flex items-center gap-2">
              <FaTruck className="text-yellow-400" /> Easy Returns & Exchanges
            </li>
            <li className="flex items-center gap-2">
              <FaTruck className="text-yellow-400" /> Secure Payment Methods
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center justify-center gap-6 w-1/2">
          <div className="text-lg font-light text-center">Shop Our Latest Collection</div>
          <button className="bg-yellow-400 text-black py-2 px-6 rounded-full font-semibold hover:bg-yellow-500 transition">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  )
}
