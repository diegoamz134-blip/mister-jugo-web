import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { fetchFeaturedProducts, fetchCategories } from '../store/productSlice'
import HeroBanner from '../components/home/HeroBanner'
import CategoryCarousel from '../components/home/CategoryCarousel'
import ProductCard from '../components/home/ProductCard'

export default function Home() {
  const dispatch = useAppDispatch()
  const { categories, featuredProducts, loading } = useAppSelector((state) => state.products)
  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const featuredImages = [
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1200',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200',
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200',
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroBanner />

      <section className="py-10 sm:py-14 lg:py-18 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mb-6 sm:mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-800">
              Categorías
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-secondary-500 mt-1">
              Desliza y descubre
            </p>
          </motion.div>
        </div>

        {loading && categories.length === 0 ? (
          <div className="flex gap-4 px-4 sm:px-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[200px] sm:w-[250px] lg:w-[290px] h-[250px] sm:h-[300px] lg:h-[350px] rounded-3xl bg-secondary-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <CategoryCarousel categories={categories} />
        )}
      </section>

      <section className="bg-secondary-50 py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800">Productos Destacados</h2>
              <p className="text-sm sm:text-base text-secondary-500 mt-1">Lo más popular de Mister Jugo</p>
            </div>
          </motion.div>

          {loading && featuredProducts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl bg-white overflow-hidden">
                  <div className="h-44 sm:h-52 bg-secondary-100 animate-pulse" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="h-4 bg-secondary-100 rounded animate-pulse w-1/3" />
                    <div className="h-5 bg-secondary-100 rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-secondary-100 rounded animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden min-h-[250px] sm:h-[300px] bg-gradient-to-r from-primary-500 to-primary-700"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${featuredImages[Math.floor(Math.random() * featuredImages.length)]}')` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
              ¿Listo para ordenar?
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-6 max-w-md">
              Pide ahora y recibe en menos de 30 minutos. Delivery gratuito en pedidos mayores a S/ 50.
            </p>
            <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-primary-600 font-bold rounded-xl hover:bg-secondary-50 transition-colors shadow-2xl text-sm sm:text-base">
              Ordenar Ahora
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
