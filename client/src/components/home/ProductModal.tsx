import { useState, useEffect } from 'react'
import { X, Minus, Plus, Star, Clock, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '../../hooks/useStore'
import { addToCart } from '../../store/cartSlice'
import { addToast } from '../../store/uiSlice'
import { formatPrice } from '../../lib/utils'
import Button from '../ui/Button'
import api from '../../services/api'
import type { Product, ProductOptionGroup, SelectedOption } from '../../types'

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const dispatch = useAppDispatch()
  const [groups, setGroups] = useState<ProductOptionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [adding, setAdding] = useState(false)
  const [flying, setFlying] = useState(false)
  const [btnRect, setBtnRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    setQuantity(1)
    api.get(`/products/${product.slug}/options`).then((res) => {
      let data = res.data as ProductOptionGroup[]
      
      // Opciones para Jugos
      if (product.category?.slug === 'jugos-frescos') {
        const preferenciasGroup: ProductOptionGroup = {
          id: 'prefs-jugos',
          productId: product.id,
          name: 'Preferencias',
          type: 'checkbox',
          required: false,
          order: 1,
          options: [
            { id: 'al-tiempo', groupId: 'prefs-jugos', name: 'Al tiempo', priceExtra: 0, isDefault: false, order: 1, active: true },
            { id: 'helado', groupId: 'prefs-jugos', name: 'Helado', priceExtra: 0, isDefault: false, order: 2, active: true },
            { id: 'stevia', groupId: 'prefs-jugos', name: 'Con Stevia', priceExtra: 0, isDefault: false, order: 3, active: true },
            { id: 'sin-lactosa', groupId: 'prefs-jugos', name: 'Sin lactosa', priceExtra: 0, isDefault: false, order: 4, active: true },
          ]
        }
        
        const extraLecheGroup: ProductOptionGroup = {
          id: 'extra-leche',
          productId: product.id,
          name: 'Tipo de Leche (S/ 2.00)',
          type: 'radio',
          required: false,
          order: 2,
          options: [
            { id: 'leche-coco', groupId: 'extra-leche', name: 'Leche de Coco', priceExtra: 2, isDefault: false, order: 1, active: true },
            { id: 'leche-almendra', groupId: 'extra-leche', name: 'Leche de Almendra', priceExtra: 2, isDefault: false, order: 2, active: true },
            { id: 'leche-soya', groupId: 'extra-leche', name: 'Leche de Soya', priceExtra: 2, isDefault: false, order: 3, active: true },
          ]
        }
        
        data = [...data, preferenciasGroup, extraLecheGroup]
      } else {
        // Inject "Cremas" for non-jugos categories
        const cremasGroup: ProductOptionGroup = {
          id: 'cremas-group',
          productId: product.id,
          name: 'Cremas (Opcional)',
          type: 'checkbox',
          required: false,
          order: 100,
          options: [
            { id: 'ketchup', groupId: 'cremas-group', name: 'Ketchup', priceExtra: 0, isDefault: false, order: 1, active: true },
            { id: 'mostaza', groupId: 'cremas-group', name: 'Mostaza', priceExtra: 0, isDefault: false, order: 2, active: true },
            { id: 'mayonesa', groupId: 'cremas-group', name: 'Mayonesa', priceExtra: 0, isDefault: false, order: 3, active: true },
            { id: 'aji', groupId: 'cremas-group', name: 'Ají', priceExtra: 0, isDefault: false, order: 4, active: true },
          ]
        }
        data = [...data, cremasGroup]
      }

      setGroups(data)
      const initial: Record<string, string[]> = {}
      data.forEach((g) => {
        const defaults = g.options.filter((o) => o.isDefault).map((o) => o.id)
        initial[g.id] = defaults
      })
      setSelections(initial)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [isOpen, product.slug, product.id, product.category])

  const toggleOption = (groupId: string, optionId: string, type: string, isRequired: boolean = false) => {
    setSelections((prev) => {
      const current = prev[groupId] || []
      const exists = current.includes(optionId)
      
      if (type === 'radio') {
        if (exists && !isRequired) {
          return { ...prev, [groupId]: [] }
        }
        return { ...prev, [groupId]: [optionId] }
      }
      
      return {
        ...prev,
        [groupId]: exists ? current.filter((id) => id !== optionId) : [...current, optionId],
      }
    })
  }

  const extrasTotal = groups.reduce((sum, g) => {
    const selected = selections[g.id] || []
    selected.forEach((optId) => {
      const opt = g.options.find((o) => o.id === optId)
      if (opt) sum += opt.priceExtra
    })
    return sum
  }, 0)

  const unitPrice = product.price + extrasTotal
  const totalPrice = unitPrice * quantity

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setBtnRect(e.currentTarget.getBoundingClientRect())
    setAdding(true)
    const opts: SelectedOption[] = []
    groups.forEach((g) => {
      const selected = selections[g.id] || []
      selected.forEach((optId) => {
        const opt = g.options.find((o) => o.id === optId)
        if (opt) {
          opts.push({
            groupId: g.id,
            groupName: g.name,
            optionId: opt.id,
            optionName: opt.name,
            priceExtra: opt.priceExtra,
          })
        }
      })
    })

    try {
      await dispatch(addToCart({ productId: product.id, quantity, options: JSON.stringify(opts) })).unwrap()
      dispatch(addToast({ message: `${product.name} agregado al carrito`, type: 'success' }))
      
      setFlying(true)
      setTimeout(() => {
        setFlying(false)
        setAdding(false)
        onClose()
      }, 700)
    } catch {
      dispatch(addToast({ message: 'Error al agregar al carrito', type: 'error' }))
      setAdding(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* Modal — centrado absoluto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed z-[90] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[880px] max-h-[90vh] md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden
                         flex flex-col md:flex-row pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── COLUMNA IZQUIERDA: imagen + info del producto ── */}
              <div className="relative md:w-[42%] flex-shrink-0 h-60 sm:h-72 md:h-auto min-h-0">
                {/* Imagen */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                {/* Botón cerrar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/30 backdrop-blur-md text-white
                             hover:bg-black/50 transition-colors z-10"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges: tiempo y rating */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-secondary-700">
                    <Clock className="w-3.5 h-3.5" />
                    {product.prepTime} min
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-secondary-700">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {product.rating.toFixed(1)}
                  </div>
                </div>

                {/* Info sobre la imagen (parte inferior) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                  <span className="inline-block text-[11px] font-semibold text-white/70 uppercase tracking-widest mb-1">
                    {product.category?.name}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                    {product.name}
                  </h2>
                  {/* Precio — visible en desktop sobre la imagen */}
                  <div className="hidden md:flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">{formatPrice(product.price)}</span>
                    {product.discountPrice && (
                      <span className="text-sm text-white/55 line-through">{formatPrice(product.discountPrice)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── COLUMNA DERECHA: descripción + opciones + pie ── */}
              <div className="flex-1 flex flex-col min-h-0">

                {/* Precio móvil (solo se ve en pantallas pequeñas) */}
                <div className="md:hidden px-5 pt-4 pb-1">
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">
                    {product.category?.name}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-secondary-800">{formatPrice(product.price)}</span>
                    {product.discountPrice && (
                      <span className="text-sm text-secondary-400 line-through">{formatPrice(product.discountPrice)}</span>
                    )}
                  </div>
                </div>

                {/* Área desplazable: descripción + opciones */}
                <div className="flex-1 overflow-y-auto px-5 py-4 md:p-6 space-y-6">

                  {/* Descripción */}
                  <p className="text-sm md:text-base text-secondary-500 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Opciones / Extras */}
                  {loading ? (
                    <div className="space-y-5">
                      {[1, 2].map((i) => (
                        <div key={i}>
                          <div className="h-4 w-28 bg-secondary-100 rounded animate-pulse mb-3" />
                          <div className="flex gap-2">
                            {[1, 2, 3].map((j) => (
                              <div key={j} className="h-10 w-24 bg-secondary-100 rounded-xl animate-pulse" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-secondary-400">
                      <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-sm">Sin opciones adicionales</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groups.map((group) => (
                        <div key={group.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-semibold text-secondary-700">{group.name}</h3>
                            {group.required && (
                              <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                Requerido
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {group.options.map((opt) => {
                              const isSelected = (selections[group.id] || []).includes(opt.id)
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => toggleOption(group.id, opt.id, group.type, group.required)}
                                  className={`group flex items-center justify-between p-3.5 sm:px-4 rounded-2xl transition-all duration-300 border-2 ${
                                    isSelected
                                      ? 'bg-primary-50/50 border-primary-500/30 shadow-sm shadow-primary-500/5'
                                      : 'bg-white border-transparent hover:border-secondary-200 hover:bg-secondary-50/50 ring-1 ring-secondary-100'
                                  }`}
                                >
                                  <div className="flex flex-col items-start">
                                    <span className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                                      isSelected ? 'text-primary-700' : 'text-secondary-700'
                                    }`}>
                                      {opt.name}
                                    </span>
                                    {opt.priceExtra > 0 && (
                                      <span className={`text-xs mt-0.5 font-medium transition-colors duration-300 ${
                                        isSelected ? 'text-primary-500/80' : 'text-secondary-400'
                                      }`}>
                                        +{formatPrice(opt.priceExtra)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Custom Checkbox/Radio Indicator con Animación */}
                                  <div className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                    group.type === 'radio' ? 'w-6 h-6 rounded-full' : 'w-6 h-6 rounded-md'
                                  } border-2 ${
                                    isSelected 
                                      ? 'border-primary-500 bg-primary-500' 
                                      : 'border-secondary-300 group-hover:border-primary-300 bg-white'
                                  }`}>
                                    <motion.div
                                      initial={false}
                                      animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                      {group.type === 'radio' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                      ) : (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </motion.div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Pie fijo: cantidad + total + botón ── */}
                <div className="border-t border-secondary-100 px-5 py-4 md:p-6 bg-white flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    {/* Selector cantidad */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-secondary-500 font-medium">Cantidad</span>
                      <div className="flex items-center gap-1 bg-secondary-50 rounded-xl p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="p-1.5 rounded-lg text-secondary-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-secondary-800 text-lg">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1.5 rounded-lg text-secondary-600 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-xs text-secondary-400 mb-0.5">Total</p>
                      <p className="text-xl sm:text-2xl font-extrabold text-primary-500">{formatPrice(totalPrice)}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAdd}
                    loading={adding}
                    size="lg"
                    className="w-full text-sm sm:text-base"
                  >
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animación de vuelo al carrito */}
          {flying && btnRect && (
            <motion.div
              initial={{ 
                position: 'fixed',
                left: btnRect.left + btnRect.width / 2 - 24,
                top: btnRect.top + btnRect.height / 2 - 24,
                scale: 1, 
                opacity: 1, 
                zIndex: 99999 
              }}
              animate={{ 
                left: window.innerWidth - (window.innerWidth < 1024 ? 50 : 180), // posición aprox del icono del carrito
                top: window.innerWidth < 1024 ? 20 : 30, 
                scale: 0.1, 
                opacity: 0.2 
              }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} // Curva ease out fuerte
              className="w-12 h-12 rounded-full shadow-2xl overflow-hidden border-2 border-primary-500 bg-white pointer-events-none"
            >
              <img src={product.image} alt="" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
