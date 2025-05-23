'use client'
import { useState, useRef, useEffect, useMemo } from 'react' // Added useMemo
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProducts } from '@/lib/fetchProducts' // Your product fetching utility
import formatCurrency from '@/lib/formatCurrency'; // Assuming you have this utility

export default function BestsellersCollection() {
  const [bestsellerProducts, setBestsellerProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const yText = useTransform(scrollYProgress, [0, 0.5], ["30%", "0%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const scaleBg = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])

  useEffect(() => {
    const getBestsellerProducts = async () => {
      try {
        setIsLoading(true)
        const productsData = await fetchProducts()
        if (productsData && productsData.products) {
          // For demonstration, taking the first 4.
          // In a real scenario, you'd have actual bestseller logic.
          setBestsellerProducts(productsData.products.slice(0, 4))
        }
      } catch (error) {
        console.error("Failed to load bestseller products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getBestsellerProducts()
  }, [])

  // Inner Product Card Component Logic (adapted from original ProductCard)
  const ProductItem = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Safeguard against undefined product
    if (!product) return null;

    // Extract clean product ID
    const productId = useMemo(() => {
      if (typeof product.id === 'string') {
        return product.id.split('/').pop();
      }
      return product.id;
    }, [product.id]);

    // Process product images with fallbacks
    const images = useMemo(() => {
      if (product.images?.length > 0) {
        return product.images.map(img => ({
          url: typeof img === 'string' ? img : img.url || img.src,
          alt: product.title || "Product image"
        }));
      }
      if (product.featuredImage) {
        return [{
          url: typeof product.featuredImage === 'string'
            ? product.featuredImage
            : product.featuredImage.url,
          alt: product.title || "Product image"
        }];
      }
      return [{ url: '/placeholder-product.jpg', alt: "Placeholder image" }];
    }, [product]);

    // Price calculations
    const price = product.priceRange?.minVariantPrice?.amount || product.price || 0;
    const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount || product.compareAtPrice || 0;
    const discountPercentage = compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

    return (
      <motion.div
        className="relative group bg-charcoal-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-gold-500/30 transition-shadow duration-500" // Darker background for each card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Luxury Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.tags?.includes('new') && (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gold-500 text-charcoal-900 text-xs font-medium px-3 py-1 rounded-full shadow-lg uppercase"
            >
              NEW
            </motion.span>
          )}
          {discountPercentage > 0 && (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg uppercase"
            >
              -{discountPercentage}%
            </motion.span>
          )}
        </div>

        {/* Product Image with Hover Transition */}
        <Link href={`/product/${productId}`} className="block overflow-hidden">
          <div className="relative aspect-[3/4] w-full">
            <AnimatePresence mode="wait">
              {/* Main Image */}
              <motion.div
                key={isHovered && images.length > 1 ? "hover-image" : "main-image"} // Key changes based on hover to trigger AnimatePresence
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={isHovered && images.length > 1 ? images[1]?.url : images[0]?.url || '/placeholder-product.jpg'}
                  alt={isHovered && images.length > 1 ? images[1]?.alt : images[0]?.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105" // Zoom effect on hover
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={true} // Priority for initial load
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-5 pt-3 space-y-2 text-white"> {/* Adjusted padding and text color to white */}
          {/* Title & Price */}
          <div className="flex justify-between items-start">
            <Link href={`/product/${productId}`}>
              <h3 className="font-serif text-xl font-light hover:text-gold-400 transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1 uppercase tracking-wide">{product.productType}</p>
            </Link>

            <div className="text-right">
              {compareAtPrice > 0 ? (
                <>
                  <span className="text-gold-400 text-xl font-medium"> {/* Price in gold */}
                    {formatCurrency(price)}
                  </span>
                  <span className="block text-sm text-gray-500 line-through">
                    {formatCurrency(compareAtPrice)}
                  </span>
                </>
              ) : (
                <span className="font-medium text-gold-400 text-xl"> {/* Price in gold */}
                  {formatCurrency(price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };


  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden bg-black text-white py-20 md:py-32"
    >
      {/* Luxury texture background */}
      <motion.div
        style={{ scale: scaleBg }}
        className="absolute inset-0 opacity-10 filter brightness-50"
      >
        <Image
          src="https://picsum.photos/id/1060/1920/1080"
          alt="Luxury background texture"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Section Header */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 text-center mb-16 px-6"
      >
        <h2 className="text-5xl md:text-7xl font-serif font-light tracking-wide text-white drop-shadow-lg">
          CURATED BESTSELLERS
        </h2>
        <p className="mt-4 text-xl md:text-2xl text-gold-400 font-light tracking-widest uppercase">
          OUR MOST COVETED DESIGNS
        </p>
      </motion.div>

      {/* Bestsellers Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-charcoal-800 rounded-lg shadow-2xl animate-pulse aspect-[3/4]"></div>
            ))}
          </div>
        ) : bestsellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {bestsellerProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 + (bestsellerProducts.indexOf(product) * 0.1) }}
                >
                  <ProductItem product={product} /> {/* Use the inline ProductItem */}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center text-white/70 text-lg py-10">
            No bestseller products found at the moment. Please check back later!
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="relative z-20 text-center pt-10 pb-20">
        <Link href="/shop">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#E5E7EB",
              color: "#1A1A1A"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 border-2 border-white text-white text-base tracking-widest font-semibold uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
          >
            DISCOVER THE FULL COLLECTION
          </motion.button>
        </Link>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/5 rounded-full filter blur-3xl opacity-40 animate-pulse-slow-reverse" />
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.1) translate(10px, -10px);
          }
        }
        @keyframes pulse-slow-reverse {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.1) translate(-10px, 10px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 8s infinite ease-in-out;
        }
      `}</style>
    </section>
  )
}