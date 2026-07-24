import { useState } from 'react'
import { Heart, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '../../lib/utils'
import Rating from '../ui/Rating'
import ProductModal from './ProductModal'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [favorited, setFavorited] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -6 }}
        className="group bg-white rounded-2xl sm:rounded-3xl border border-secondary-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <button
            onClick={(e) => { e.stopPropagation(); setFavorited(!favorited) }}
            className={`absolute top-3 right-3 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm transition-all ${
              favorited ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-secondary-600 hover:bg-white'
            }`}
            aria-label="Favorito"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-secondary-700">
            <Clock className="w-3 h-3.5" />
            {product.prepTime} min
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-primary-500 uppercase tracking-wide">
              {product.category?.name}
            </span>
          </div>
          <h3 className="font-semibold text-secondary-800 text-sm sm:text-base mb-1 leading-snug">{product.name}</h3>
          <p className="text-xs sm:text-sm text-secondary-500 line-clamp-2 mb-3">{product.description}</p>
          <Rating value={product.rating} count={product.ratingCount} />
          
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-secondary-100">
            <div>
              <span className="text-base sm:text-xl font-bold text-secondary-800">{formatPrice(product.price)}</span>
              {product.discountPrice && (
                <span className="text-xs sm:text-sm text-secondary-400 line-through ml-2">{formatPrice(product.discountPrice)}</span>
              )}
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all"
              aria-label="Personalizar y agregar"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <ProductModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
