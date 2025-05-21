"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, fetchProducts } from "@/lib/fetchProducts";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { FiShare2 } from "react-icons/fi";
import Image from "next/image";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        const shopifyId = `gid://shopify/Product/${id}`;
        const productData = await fetchProductById(shopifyId);
        
        if (!productData) throw new Error("Product not found");

        setProduct(productData);
        
        // Size inventory handling from Code 2
        if (productData.sizes) {
          setSizes(productData.sizes);
        } else if (productData?.variants) {
          // Fallback to variant processing if sizes not directly available
          const availableSizes = productData.variants.map(variant => ({
            id: variant.id,
            size: variant.title.split('/')[0]?.trim() || variant.title || "Standard",
            available: variant.availableForSale,
            stock: variant.inventoryQuantity || 0,
            price: variant.price
          }));
          setSizes(availableSizes);
        }

        // Fetch recommended products
        const allProductsResponse = await fetchProducts();
        const allProducts = Array.isArray(allProductsResponse?.products) 
          ? allProductsResponse.products 
          : [];
        
        setRecommendedProducts(
          allProducts
            .filter(p => p.id !== shopifyId)
            .slice(0, 4)
        );

      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleSizeSelection = (size) => {
    if (sizes.find((s) => s.size === size)?.available) {
      setSelectedSize(size);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.title === selectedSize || variant.size === selectedSize
    );
  
    if (!selectedVariant) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
  
    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.images[0] || "/luxury-fallback.jpg",
      size: selectedSize,
      quantity: quantity,
      productHandle: product.handle,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="animate-pulse text-charcoal-900 font-serif tracking-wider">
          LOADING MASTERPIECE...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">
        <p className="text-charcoal-900 font-serif">This exclusive piece is currently unavailable</p>
      </div>
    );
  }

  const mainImage = product.images[selectedImage] || "/placeholder-luxury.jpg";

  return (
    <div className="bg-ivory-50 text-charcoal-900">
      {showToast && (
        <div className="fixed top-4 right-4 bg-charcoal-900 text-ivory-50 px-6 py-3 rounded-sm z-50 animate-fade-in">
          {!selectedSize ? "Please select a size" : "Added to cart"}
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative aspect-[3/4] bg-gray-50">
              <Image
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.tags?.includes('new') && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs tracking-widest">
                  NEW ARRIVAL
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden transition-opacity ${
                      selectedImage === index ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                    }`}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-serif font-light tracking-tight mb-2">
              {product.title}
            </h1>
            <p className="text-charcoal-600 text-sm mb-6">
              {product.productType || "Luxury Formalwear"}
            </p>

            <div className="mb-8">
              <span className="text-2xl font-light">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0
                }).format(parseFloat(product.price))}
              </span>
              {product.compareAtPrice && (
                <span className="text-charcoal-400 line-through ml-2">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(product.compareAtPrice))}
                </span>
              )}
            </div>

            <div className="prose max-w-none text-charcoal-600 mb-8">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h2 className="text-sm font-medium mb-3">SELECT SIZE</h2>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((sizeInfo) => (
                  <button
                    key={sizeInfo.size}
                    onClick={() => handleSizeSelection(sizeInfo.size)}
                    disabled={!sizeInfo.available}
                    className={`py-2 text-center text-sm border relative transition-colors ${
                      selectedSize === sizeInfo.size
                        ? 'border-black text-black'
                        : sizeInfo.available
                        ? 'border-gray-300 hover:border-gray-500'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    aria-label={`${sizeInfo.size} ${
                      !sizeInfo.available ? '(out of stock)' : 
                      sizeInfo.stock < 5 ? `(only ${sizeInfo.stock} left)` : ''
                    }`}
                  >
                    {sizeInfo.size}
                    {sizeInfo.available && sizeInfo.stock < 5 && (
                      <span className="absolute -top-1 -right-1 bg-charcoal-900 text-ivory-50 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {sizeInfo.stock}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-4">
                QUANTITY
              </h3>
              <div className="flex border border-ivory-300 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-ivory-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="px-6 py-2 border-x border-ivory-300 text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={selectedSize && sizes.find(s => s.size === selectedSize)?.stock <= quantity}
                  className="px-4 py-2 hover:bg-ivory-100 transition-colors disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {selectedSize && sizes.find(s => s.size === selectedSize)?.stock <= quantity && (
                <p className="text-xs text-red-500 mt-1">
                  Only {sizes.find(s => s.size === selectedSize)?.stock} available
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || sizes.find(s => s.size === selectedSize)?.stock < quantity}
                className="bg-charcoal-900 text-ivory-50 py-4 uppercase tracking-wider text-sm font-medium hover:bg-charcoal-800 transition-colors disabled:opacity-50"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize || sizes.find(s => s.size === selectedSize)?.stock < quantity}
                className="border border-charcoal-900 py-4 uppercase tracking-wider text-sm font-medium hover:bg-ivory-100 transition-colors disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
              className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors"
              aria-label="Share product"
            >
              <FiShare2 className="w-4 h-4" />
              Share this masterpiece
            </button>
          </div>
        </div>

        {/* Recommended */}
        {recommendedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-serif font-light tracking-tight mb-8 text-center">
              COMPLETE YOUR ENSEMBLE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}