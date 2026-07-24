import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { fetchProducts, fetchCategories } from '../store/productSlice'
import ProductCard from '../components/home/ProductCard'
import Button from '../components/ui/Button'

export default function Menu() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { products, categories, loading } = useAppSelector((state) => state.products)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [scrolled, setScrolled] = useState(false)
  
  // Refs para el scrollspy
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const categoryBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Obtener todos los productos sin paginación (límite alto)
  useEffect(() => {
    dispatch(fetchProducts({ search, limit: 100 }))
  }, [dispatch, search])

  // Detectar scroll para efecto glass de la barra
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Configurar IntersectionObserver para Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Encontrar la sección más visible
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Si hay varias visibles, tomamos la primera o la que tenga mayor ratio
          const mostVisible = visibleEntries.reduce((prev, current) => 
            (prev.intersectionRatio > current.intersectionRatio) ? prev : current
          )
          
          const categoryId = mostVisible.target.getAttribute('data-category-id')
          if (categoryId && categoryId !== activeCategory) {
            setActiveCategory(categoryId)
            
            // Hacer scroll horizontal de la barra de categorías si es necesario
            const button = categoryBarRef.current?.querySelector(`[data-btn-id="${categoryId}"]`) as HTMLElement
            if (button && categoryBarRef.current) {
              const bar = categoryBarRef.current
              const btnRect = button.getBoundingClientRect()
              const barRect = bar.getBoundingClientRect()
              
              if (btnRect.left < barRect.left || btnRect.right > barRect.right) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
              }
            }
          }
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Ajustar márgenes para detectar cuando el título entra en la parte superior
        threshold: 0
      }
    )

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [categories, products, activeCategory]) // Dependencias actualizadas

  // Al cargar con query param, hacer scroll hacia esa categoría inicial
  useEffect(() => {
    const catSlug = searchParams.get('categoria')
    if (catSlug && categories.length > 0) {
      const match = categories.find((c) => c.slug === catSlug)
      if (match) {
        setTimeout(() => scrollToCategory(match.id), 500)
      }
    }
  }, [searchParams, categories])

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    const section = sectionRefs.current[categoryId]
    if (section) {
      // 140px de offset para evitar que el header y la barra sticky tapen el título
      const y = section.getBoundingClientRect().top + window.scrollY - 140
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Agrupar productos por categoría, omitiendo categorías vacías a menos que haya búsqueda
  const groupedProducts = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categoryId === cat.id)
    return { category: cat, products: catProducts }
  }).filter(group => group.products.length > 0)

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20 lg:pt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-orange-500 p-6 sm:p-10 shadow-xl shadow-primary-500/20 mb-4"
        >
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tight drop-shadow-md">
                ¿Qué se te antoja hoy?
              </h1>
              <p className="text-primary-50 text-sm sm:text-base lg:text-lg font-medium drop-shadow-sm">
                Descubre todos nuestros sabores. Preparados al instante con los mejores ingredientes para ti.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <div className="relative w-full sm:w-80 shadow-lg shadow-black/10 rounded-2xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar hamburguesas, jugos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-0 rounded-2xl text-sm font-medium
                    focus:outline-none focus:ring-4 focus:ring-white/40
                    placeholder:text-secondary-400 transition-all text-secondary-800"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-2xl transition-colors backdrop-blur-md border border-white/20 shadow-lg shadow-black/5">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* STICKY CATEGORY BAR */}
      <div className={`sticky top-[68px] sm:top-[76px] z-40 transition-all duration-500 ease-in-out ${
        scrolled ? 'px-3 sm:px-5 lg:px-8' : 'px-0'
      }`}>
        <div className={`transition-all duration-500 ease-in-out py-3 ${
          scrolled 
            ? 'bg-white/60 backdrop-blur-2xl border-x border-b border-white/70 shadow-2xl shadow-black/[0.08] rounded-b-2xl'
            : 'bg-white/90 backdrop-blur-md border-b border-secondary-100 shadow-sm'
        }`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div 
              ref={categoryBarRef}
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth"
            >
            {groupedProducts.map(({ category: cat }) => (
              <button
                key={cat.id}
                data-btn-id={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border ${
                  activeCategory === cat.id
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                    : 'bg-white/80 text-secondary-600 border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* SECTIONS CON PRODUCTOS */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 pb-24">
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl sm:rounded-3xl bg-white border border-secondary-100 overflow-hidden">
                <div className="h-44 sm:h-52 bg-secondary-100 animate-pulse" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 bg-secondary-100 rounded animate-pulse w-1/3" />
                  <div className="h-5 bg-secondary-100 rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-secondary-100 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 sm:py-20 mt-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-1">Sin resultados</h3>
            <p className="text-xs sm:text-sm text-secondary-500">No encontramos productos con ese criterio de búsqueda</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 sm:gap-16">
            {groupedProducts.map(({ category: cat, products: catProducts }) => (
              <section 
                key={cat.id} 
                data-category-id={cat.id}
                ref={(el) => (sectionRefs.current[cat.id] = el)}
                className="scroll-mt-36"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-800 mb-4 sm:mb-6 flex items-center gap-2">
                  {cat.name}
                  <span className="text-sm font-medium px-2.5 py-1 bg-secondary-100 text-secondary-500 rounded-lg">
                    {catProducts.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {catProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
