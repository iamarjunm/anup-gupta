'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, fetchProducts } from '@/lib/fetchProducts';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { FiShare2, FiPlus, FiMinus } from 'react-icons/fi';
import Image from 'next/image';

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
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        const shopifyId = `gid://shopify/Product/${id}`;
        const productData = await fetchProductById(shopifyId);

        if (!productData) throw new Error('Product not found');

        setProduct(productData);

        if (productData.sizes) {
          setSizes(productData.sizes);
        } else if (productData?.variants) {
          const availableSizes = productData.variants.map((variant) => ({
            id: variant.id,
            size: variant.title.split('/')[0]?.trim() || variant.title || 'Standard',
            available: variant.availableForSale,
            stock: variant.inventoryQuantity || 0,
            price: variant.price,
          }));
          setSizes(availableSizes);
        }

        const allProductsResponse = await fetchProducts();
        const allProducts = Array.isArray(allProductsResponse?.products)
          ? allProductsResponse.products
          : [];

        setRecommendedProducts(allProducts.filter((p) => p.id !== shopifyId).slice(0, 4));
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  };

  const handleSizeSelection = (size) => {
    if (sizes.find((s) => s.size === size)?.available) {
      setSelectedSize(size);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      triggerToast('Please select a size to add to cart.');
      return;
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.title === selectedSize || variant.size === selectedSize
    );

    if (!selectedVariant) {
      triggerToast('Selected size variant not found.');
      return;
    }

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.images[0] || '/luxury-fallback.jpg',
      size: selectedSize,
      quantity: quantity,
      productHandle: product.handle,
    });

    triggerToast('Product added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      triggerToast('Please select a size to proceed.');
      return;
    }
    handleAddToCart();
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center"> {/* Removed pt-20 */}
        <div className="animate-pulse text-charcoal-900 font-serif tracking-wider text-xl">
          LOADING MASTERPIECE...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center"> {/* Removed pt-20 */}
        <p className="text-charcoal-900 font-serif text-lg">This exclusive piece is currently unavailable.</p>
      </div>
    );
  }

  const mainImage = product.images[selectedImage] || '/placeholder-luxury.jpg';

  return (
    <div className="bg-ivory-50 text-charcoal-900 min-h-screen"> {/* Removed pt-20 */}
      {showToast && (
       <div className="fixed top-20 right-6 bg-charcoal-900 text-ivory-50 px-6 py-3 rounded-sm shadow-lg z-50 animate-fade-in text-sm transition-all duration-300 ease-in-out">
  {toastMessage}
</div>

      )}

      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8"> {/* Adjusted py-8 to py-12 for top spacing without push */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4"> {/* Reduced space-y for tighter image grouping */}
            {/* Main Product Image */}
            <div className="relative w-full overflow-hidden shadow-md aspect-[3/4]"> {/* Removed rounded-lg */}
              <Image
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              />
              {product.tags?.includes('new') && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs tracking-widest uppercase z-10">
                  NEW ARRIVAL
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2"> {/* Reduced gap */}
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`block aspect-square overflow-hidden border transition-all duration-200 ${ /* Reduced border-2 to border */
                      selectedImage === index ? 'border-charcoal-900' : 'border-gray-200 opacity-70 hover:opacity-100' // Removed scale-105 on hover
                    }`}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100} // Slightly reduced thumbnail size
                      height={100} // Slightly reduced thumbnail size
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col pt-4 lg:pt-0">
            <h1 className="text-4xl font-serif font-normal tracking-tight mb-2 leading-tight"> {/* Reduced mb-3 to mb-2 */}
              {product.title}
            </h1>
            <p className="text-charcoal-600 text-sm mb-6 font-light"> {/* Reduced text-base to text-sm */}
              {product.productType || 'Luxury Formalwear'}
            </p>

            <div className="mb-7 flex items-baseline"> {/* Adjusted mb-8 to mb-7 */}
              <span className="text-3xl font-semibold">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                }).format(parseFloat(product.price))}
              </span>
              {product.compareAtPrice &&
                parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-charcoal-400 line-through ml-3 text-lg">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                    }).format(parseFloat(product.compareAtPrice))}
                  </span>
                )}
            </div>

            <div className="prose max-w-none text-charcoal-700 text-sm leading-relaxed mb-7"> {/* Adjusted mb-8 to mb-7 */}
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-7"> {/* Adjusted mb-8 to mb-7 */}
                <h2 className="text-xs font-medium uppercase tracking-wider mb-3"> {/* Reduced mb-4 to mb-3 */}
                  SELECT SIZE
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2"> {/* Reduced gap */}
                  {sizes.map((sizeInfo) => (
                    <button
                      key={sizeInfo.size}
                      onClick={() => handleSizeSelection(sizeInfo.size)}
                      disabled={!sizeInfo.available}
                      className={`relative px-4 py-2 text-center text-sm border font-medium transition-all duration-200 ease-in-out ${ /* Reduced py-3 to py-2, border-2 to border, removed rounded-md */
                        selectedSize === sizeInfo.size
                          ? 'border-charcoal-900 bg-charcoal-900 text-ivory-50'
                          : sizeInfo.available
                          ? 'border-gray-300 text-charcoal-900 hover:border-charcoal-900' // Removed hover:bg-gray-100
                          : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-70'
                      }`}
                      aria-label={`${sizeInfo.size} ${
                        !sizeInfo.available ? '(out of stock)' : sizeInfo.stock < 5 ? `(only ${sizeInfo.stock} left)` : ''
                      }`}
                    >
                      {sizeInfo.size}
                      {sizeInfo.available && sizeInfo.stock < 5 && sizeInfo.stock > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"> {/* Slightly reduced size */}
                          {sizeInfo.stock}
                        </span>
                      )}
                      {!sizeInfo.available && (
                        <span className="absolute inset-0 flex items-center justify-center text-red-500 opacity-80">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Slightly reduced size */}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-7"> {/* Adjusted mb-8 to mb-7 */}
              <h3 className="text-xs font-medium uppercase tracking-wider mb-3"> {/* Reduced mb-4 to mb-3 */}
                QUANTITY
              </h3>
              <div className="flex border border-gray-300 w-fit overflow-hidden"> {/* Removed rounded-md */}
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-ivory-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <div className="px-6 py-2 border-x border-gray-300 text-center font-medium">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={selectedSize && sizes.find((s) => s.size === selectedSize)?.stock <= quantity}
                  className="px-4 py-2 bg-ivory-50 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              {selectedSize && sizes.find((s) => s.size === selectedSize)?.stock <= quantity && (
                <p className="text-xs text-red-500 mt-2">
                  Only {sizes.find((s) => s.size === selectedSize)?.stock} available.
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8"> {/* Reduced gap to gap-3 */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || sizes.find((s) => s.size === selectedSize)?.stock < quantity}
                className="bg-charcoal-900 text-ivory-50 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" // Removed rounded-md, reduced py-4 to py-3
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize || sizes.find((s) => s.size === selectedSize)?.stock < quantity}
                className="border border-charcoal-900 text-charcoal-900 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-charcoal-900 hover:text-ivory-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" // Removed rounded-md, reduced py-4 to py-3
              >
                Buy Now
              </button>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                triggerToast('Product link copied to clipboard!');
              }}
              className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors self-start"
              aria-label="Share product"
            >
              <FiShare2 className="w-4 h-4" />
              Share this masterpiece
            </button>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-24"> {/* Maintained mt-28 to mt-24 for slight reduction but still good separation */}
            <h2 className="text-3xl font-serif font-light tracking-tight mb-8 text-center"> {/* Reduced mb-10 to mb-8 */}
              COMPLETE YOUR ENSEMBLE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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