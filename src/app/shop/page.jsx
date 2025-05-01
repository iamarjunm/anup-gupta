'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

// Dummy data - Replace with Shopify API later
const dummyProducts = [
  {
    id: 1,
    name: "Royal Midnight Tuxedo",
    price: "£1,895",
    originalPrice: "£2,450",
    image: "https://picsum.photos/id/1005/800/1200",
    secondaryImage: "https://picsum.photos/id/1018/800/1200",
    category: "Tuxedos",
    collection: "Formal",
    details: "Hand-stitched peak lapel • Super 150s wool • Horn buttons",
    colors: ["#000000", "#1A1A1A", "#2B2B2B"],
    isNew: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 42,
    tags: ["black-tie", "wedding", "luxury"]
  },
  {
    id: 2,
    name: "Executive Power Suit",
    price: "£1,650",
    image: "https://picsum.photos/id/1027/800/1200",
    secondaryImage: "https://picsum.photos/id/1025/800/1200",
    category: "Suits",
    collection: "Business",
    details: "Full canvas construction • Italian wool • Dual vents",
    colors: ["#2D3748", "#4A5568"],
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 56,
    tags: ["office", "premium", "tailored"]
  },
  // Add 10+ more dummy products following the same structure
  {
    id: 12,
    name: "Silk Jacquard Nehru Jacket",
    price: "£950",
    image: "https://picsum.photos/id/1043/800/1200",
    secondaryImage: "https://picsum.photos/id/1040/800/1200",
    category: "Jackets",
    collection: "Evening",
    details: "Mandarin collar • Silk jacquard lining • Hand-finished",
    colors: ["#5C2D0A", "#7F4A24"],
    isNew: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 28,
    tags: ["indian-wear", "luxury", "special-occasion"]
  }
]

const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'best-selling', label: 'Best Selling' }
]

const filters = {
  categories: [
    { value: 'tuxedos', label: 'Tuxedos' },
    { value: 'suits', label: 'Suits' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'sherwanis', label: 'Sherwanis' }
  ],
  collections: [
    { value: 'formal', label: 'Formal' },
    { value: 'business', label: 'Business' },
    { value: 'evening', label: 'Evening' },
    { value: 'wedding', label: 'Wedding' }
  ],
  priceRanges: [
    { value: '0-500', label: 'Under £500' },
    { value: '500-1000', label: '£500 - £1000' },
    { value: '1000-2000', label: '£1000 - £2000' },
    { value: '2000+', label: 'Over £2000' }
  ]
}

export default function ShopPage() {  // Changed from 'shop' to 'ShopPage'
    const [products, setProducts] = useState(dummyProducts)
    const [filteredProducts, setFilteredProducts] = useState(dummyProducts)
    const [sortOption, setSortOption] = useState('newest')
    const [selectedFilters, setSelectedFilters] = useState({
      categories: [],
      collections: [],
      priceRanges: [],
      colors: []
    })
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  

  // Filter and sort products
  useEffect(() => {
    let result = [...products]
    
    // Apply filters
    if (selectedFilters.categories.length > 0) {
      result = result.filter(product => 
        selectedFilters.categories.includes(product.category.toLowerCase())
      )
    }
    
    if (selectedFilters.collections.length > 0) {
      result = result.filter(product => 
        selectedFilters.collections.includes(product.collection.toLowerCase())
      )
    }
    
    if (selectedFilters.priceRanges.length > 0) {
      result = result.filter(product => {
        const price = Number(product.price.replace(/[^0-9.-]+/g,""))
        return selectedFilters.priceRanges.some(range => {
          const [min, max] = range.split('-').map(Number)
          if (range.endsWith('+')) return price >= min
          return price >= min && price <= max
        })
      })
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price.replace(/[^0-9.-]+/g,"")) - Number(b.price.replace(/[^0-9.-]+/g,"")))
        break
      case 'price-desc':
        result.sort((a, b) => Number(b.price.replace(/[^0-9.-]+/g,"")) - Number(a.price.replace(/[^0-9.-]+/g,"")))
        break
      case 'newest':
        result.sort((a, b) => b.isNew - a.isNew)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'best-selling':
        result.sort((a, b) => b.isBestSeller - a.isBestSeller)
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [selectedFilters, sortOption, products])

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev }
      const index = newFilters[filterType].indexOf(value)
      
      if (index === -1) {
        newFilters[filterType] = [...newFilters[filterType], value]
      } else {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value)
      }
      
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      collections: [],
      priceRanges: [],
      colors: []
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative bg-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://picsum.photos/id/1060/1920/1080"
            alt="Luxury shop background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight">Shop Our Collections</h1>
          <p className="mt-4 text-xl max-w-2xl">
            Discover timeless pieces crafted with unparalleled attention to detail
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Button */}
            <button
              type="button"
              className="md:hidden flex items-center text-sm"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Categories</h3>
                <ul className="space-y-2">
                  {filters.categories.map((category) => (
                    <li key={category.value}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.categories.includes(category.value)}
                          onChange={() => handleFilterChange('categories', category.value)}
                          className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        />
                        <span className="ml-3 text-sm">{category.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Collections</h3>
                <ul className="space-y-2">
                  {filters.collections.map((collection) => (
                    <li key={collection.value}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.collections.includes(collection.value)}
                          onChange={() => handleFilterChange('collections', collection.value)}
                          className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        />
                        <span className="ml-3 text-sm">{collection.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <ul className="space-y-2">
                  {filters.priceRanges.map((range) => (
                    <li key={range.value}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.priceRanges.includes(range.value)}
                          onChange={() => handleFilterChange('priceRanges', range.value)}
                          className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        />
                        <span className="ml-3 text-sm">{range.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {Object.values(selectedFilters).flat().length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm underline text-gray-500 hover:text-black"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Dialog */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-black/50"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full max-w-xs w-full bg-white shadow-xl"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-8 overflow-y-auto h-[calc(100%-60px)]">
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {filters.categories.map((category) => (
                      <li key={category.value}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters.categories.includes(category.value)}
                            onChange={() => handleFilterChange('categories', category.value)}
                            className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                          />
                          <span className="ml-3 text-sm">{category.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Collections</h3>
                  <ul className="space-y-2">
                    {filters.collections.map((collection) => (
                      <li key={collection.value}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters.collections.includes(collection.value)}
                            onChange={() => handleFilterChange('collections', collection.value)}
                            className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                          />
                          <span className="ml-3 text-sm">{collection.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <ul className="space-y-2">
                    {filters.priceRanges.map((range) => (
                      <li key={range.value}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedFilters.priceRanges.includes(range.value)}
                            onChange={() => handleFilterChange('priceRanges', range.value)}
                            className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                          />
                          <span className="ml-3 text-sm">{range.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 px-4 py-2 border border-black text-black"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 px-4 py-2 bg-black text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}