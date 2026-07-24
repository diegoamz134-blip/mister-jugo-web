import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../hooks/useStore'
import { closeCart, fetchCart, removeCartItem } from '../../store/cartSlice'
import { formatPrice } from '../../lib/utils'
import Button from '../ui/Button'

export default function CartDrawer() {
  const dispatch = useAppDispatch()
  const { cart, isOpen } = useAppSelector((state) => state.cart)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) dispatch(fetchCart())
  }, [isOpen, dispatch])

  const items = cart?.items || []
  const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleRemove = (itemId: string) => {
    dispatch(removeCartItem(itemId))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary-100">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-secondary-800">Tu Carrito</h2>
                <p className="text-xs sm:text-sm text-secondary-500">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 rounded-xl hover:bg-secondary-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-1">Carrito vacío</h3>
                  <p className="text-xs sm:text-sm text-secondary-500 mb-6">Agrega productos para empezar tu pedido</p>
                  <Link
                    to="/"
                    onClick={() => dispatch(closeCart())}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary-500 text-white rounded-xl font-medium text-sm sm:text-base hover:bg-primary-600 transition-colors"
                  >
                    Ver menú
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item: any) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-secondary-50"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-secondary-800 text-xs sm:text-sm truncate">{item.product.name}</h4>
                        {item.options && item.options !== '[]' && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(item.options).map((opt: any, i: number) => (
                              <span key={i} className="text-[9px] sm:text-[10px] bg-secondary-200/60 text-secondary-600 px-1.5 py-0.5 rounded-md">
                                {opt.optionName}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button className="p-1 rounded-lg hover:bg-white transition-colors">
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-500" />
                            </button>
                            <span className="text-xs sm:text-sm font-semibold w-5 sm:w-6 text-center">{item.quantity}</span>
                            <button className="p-1 rounded-lg hover:bg-white transition-colors">
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="font-semibold text-xs sm:text-sm">{formatPrice(Number(item.product.price) * item.quantity)}</span>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-1 sm:p-1.5 rounded-lg hover:bg-red-50 text-secondary-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-secondary-100 p-4 sm:p-6 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-secondary-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-secondary-500">Envío</span>
                  <span className="font-medium">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold pt-2 sm:pt-3 border-t border-secondary-200">
                  <span>Total</span>
                  <span className="text-primary-500">{formatPrice(total)}</span>
                </div>
                <Button 
                  onClick={() => {
                    dispatch(closeCart())
                    navigate('/checkout')
                  }}
                  className="w-full mt-3 sm:mt-4 text-sm sm:text-base" 
                  size="lg"
                >
                  Ir a Pagar
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
