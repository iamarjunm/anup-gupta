"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import formatCurrency from "@/lib/formatCurrency";

export default function ProductCard({ product }) {
  // Safeguard against undefined product
  if (!product) return null;

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

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

  // Auto-switch to second image on hover if available
  useEffect(() => {
    if (isHovered && images.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, images.length]);

  // Price calculations
  const price = product.priceRange?.minVariantPrice?.amount || product.price || 0;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount || product.compareAtPrice || 0;
  const discountPercentage = compareAtPrice > price 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: price,
      image: images[0]?.url,
      quantity: 1
    });
  };

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Luxury Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.tags?.includes('new') && (
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg"
          >
            NEW
          </motion.span>
        )}
        {discountPercentage > 0 && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white text-red-600 border border-red-600 text-xs font-medium px-3 py-1 rounded-full shadow-lg"
          >
            -{discountPercentage}%
          </motion.span>
        )}
      </div>

      {/* Product Image with Hover Transition */}
      <Link href={`/product/${productId}`} className="block overflow-hidden rounded-lg bg-gray-50">
        <div className="relative aspect-[3/4] w-full">
          <AnimatePresence mode="wait">
            {/* Main Image */}
            <motion.div
              key="main-image"
              initial={{ opacity: 1 }}
              animate={{ opacity: isHovered && images.length > 1 ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[0]?.url || '/placeholder-product.jpg'}
                alt={images[0]?.alt}
                fill
                className="object-cover object-center transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </motion.div>

            {/* Hover Image (if available) */}
            {images.length > 1 && (
              <motion.div
                key="hover-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[1]?.url}
                  alt={images[1]?.alt}
                  fill
                  className="object-cover object-center transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-5 space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start">
          <Link href={`/product/${productId}`}>
            <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{product.productType}</p>
          </Link>
          
          <div className="text-right">
            {compareAtPrice > 0 ? (
              <>
                <span className="text-black font-medium">
                  {formatCurrency(price)}
                </span>
                <span className="block text-xs text-gray-400 line-through">
                  {formatCurrency(compareAtPrice)}
                </span>
              </>
            ) : (
              <span className="font-medium text-black">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Glow Effect */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: '0 0 100px 20px rgba(0,0,0,0.3)'
          }}
        />
      )}
    </motion.div>
  );
}