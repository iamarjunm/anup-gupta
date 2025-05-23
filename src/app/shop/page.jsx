"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts, fetchProductsByCategory } from "@/lib/fetchProducts";
import { Suspense } from 'react';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);

  // Luxury Formalwear Categories
  const categories = [
    { label: "All", href: "/shop" },
    { label: "Sherwani", href: "/shop?category=sherwani" },
    { label: "Tuxedo", href: "/shop?category=tuxedo" },
    { label: "Bandhgala", href: "/shop?category=bandhgala" },
    { label: "Suit", href: "/shop?category=suits" },
    { label: "Shirt", href: "/shop?category=shirts" },
    { label: "Nehru Jacket", href: "/shop?category=nehru-jacket" }
  ];

  // Get category from URL
  const urlCategory = searchParams.get('category');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        if (urlCategory) {
          const result = await fetchProductsByCategory(urlCategory);
          
          if (result) {
            setCurrentCollection(result.collection);
            setAllProducts(result.products);
            setProducts(result.products);
            setSelectedCategory(result.collection.title);
          }
        } else {
          const { products } = await fetchProducts();
          
          if (!products || products.length === 0) {
            console.warn('No products received from Shopify');
            return;
          }
          
          setCurrentCollection(null);
          setAllProducts(products);
          setProducts(products);
          setSelectedCategory("All");
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, [urlCategory]);

  // Filter and sort products
  useEffect(() => {
    if (loading) return;

    let filteredProducts = [...allProducts];

    if (!urlCategory && selectedCategory !== "All") {
      filteredProducts = filteredProducts.filter(
        product => product.productType === selectedCategory
      );
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => {
        const price = parseFloat(product.price);
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // Sort products
    switch (sortOption) {
      case "price-low":
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    setProducts(filteredProducts);
  }, [selectedCategory, sortOption, priceRange, loading, allProducts, urlCategory]);

  // Update price range when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => parseFloat(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [allProducts]);

  const handlePriceRangeChange = (index, value) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(value);
    setPriceRange(newPriceRange);
  };

  const CategoryButton = ({ category }) => {
    const isActive = urlCategory 
      ? (currentCollection?.title.toLowerCase() === category.label.toLowerCase())
      : (selectedCategory === category.label);
    
    return (
      <a
        href={category.href}
        className={`block w-full text-left px-4 py-3 transition-all duration-300 border-l-2 ${
          isActive
            ? 'border-black text-black font-medium bg-gray-50'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-black'
        }`}
      >
        {category.label}
      </a>
    );
  };

  const HeroSection = () => (
    <div className="relative bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-black mb-6"
        >
          {currentCollection ? currentCollection.title : 'Anup Gupta Collections'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light tracking-wider"
        >
          {currentCollection 
            ? `Exquisite ${currentCollection.title.toLowerCase()} for the discerning gentleman`
            : 'Crafting timeless elegance'}
        </motion.p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters - Desktop (Luxury Sidebar) */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-4 shadow-sm">
              <h3 className="font-serif text-xl text-black mb-8 tracking-wider uppercase">Filter</h3>
              
              {/* Category Filter */}
              <div className="mb-10">
                <h4 className="font-medium text-gray-700 mb-4 tracking-wider uppercase text-sm">Categories</h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <CategoryButton key={category.label} category={category} />
                  ))}
                </div>
              </div>

              {/* Price Filter (Luxury Slider) */}
              <div className="mb-10">
                <h4 className="font-medium text-gray-700 mb-6 tracking-wider uppercase text-sm">Price Range (₹)</h4>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-2 uppercase">Min</label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-200 text-black rounded-none focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-2 uppercase">Max</label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="100000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-200 text-black rounded-none focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="w-full h-px bg-gray-200 appearance-none cursor-pointer mb-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-black"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="w-full h-px bg-gray-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-black"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setPriceRange([0, 100000]);
                }}
                className="w-full py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wider uppercase"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters Button */}
            <div className="md:hidden flex justify-between items-center mb-8">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 bg-white border border-black px-4 py-3 text-black text-sm tracking-wider uppercase"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-black pl-3 pr-8 py-3 text-black text-sm tracking-wider uppercase focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Products Count and Sort - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <p className="text-gray-600 text-sm uppercase tracking-wider">
                Showing {products.length} {products.length === 1 ? "Item" : "Items"}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm uppercase tracking-wider">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-black pl-3 pr-8 py-2 text-black text-sm tracking-wider uppercase focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />

              {/* Filters Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="relative bg-white w-full max-w-xs flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
                  <h2 className="text-xl font-serif text-black uppercase">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors text-black"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* Category Filter */}
                  <div className="mb-10">
                    <h4 className="font-medium text-gray-700 mb-4 tracking-wider uppercase text-sm">Categories</h4>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <a
                          key={category.label}
                          href={category.href}
                          onClick={() => setMobileFiltersOpen(false)}
                          className={`block w-full text-left px-4 py-3 transition-all duration-300 border-l-2 ${
                            (urlCategory ? (currentCollection?.title.toLowerCase() === category.label.toLowerCase()) : (selectedCategory === category.label))
                              ? 'border-black text-black font-medium bg-gray-50'
                              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-black'
                          }`}
                        >
                          {category.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-10">
                    <h4 className="font-medium text-gray-700 mb-6 tracking-wider uppercase text-sm">Price Range (₹)</h4>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 uppercase">Min</label>
                          <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-black rounded-none focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 uppercase">Max</label>
                          <input
                            type="number"
                            min={priceRange[0]}
                            max="100000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-black rounded-none focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="1000"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                          className="w-full h-px bg-gray-200 appearance-none cursor-pointer mb-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-black"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="1000"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                          className="w-full h-px bg-gray-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full bg-white border border-black text-black px-6 py-3 hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wider uppercase"
                    >
                      Apply
                    </button>
                    <a
                      href="/shop"
                      className="w-full bg-black text-white px-6 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wider uppercase text-center"
                    >
                      Reset
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-lg uppercase tracking-wider">Loading Collections...</div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}