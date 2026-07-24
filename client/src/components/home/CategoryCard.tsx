import { motion } from 'framer-motion'
import type { Category } from '../../types'

interface CategoryCardProps {
  category: Category
  index: number
  isActive?: boolean
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const bgImage = category.image || `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400`

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0 w-[180px] sm:w-[200px] h-[220px] sm:h-[250px] rounded-3xl overflow-hidden group cursor-pointer"
    >
      <img
        src={bgImage}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left">
        <h3 className="font-bold text-white text-base sm:text-lg leading-tight break-words">{category.name}</h3>
        {category._count && (
          <p className="text-white/70 text-xs sm:text-sm mt-0.5">{category._count.products} productos</p>
        )}
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  )
}
