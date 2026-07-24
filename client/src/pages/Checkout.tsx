import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../hooks/useStore'
import { clearCart } from '../store/cartSlice'
import { formatPrice } from '../lib/utils'
import Button from '../components/ui/Button'
import { MapPin, CheckCircle, ArrowLeft, Bike } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.cart)
  
  const [address, setAddress] = useState('')
  const [reference, setReference] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const items = cart?.items || []
  
  const subtotal = items.reduce((sum, item) => {
    let itemTotal = item.product.price
    if (item.options) {
      try {
        const opts = JSON.parse(item.options)
        opts.forEach((o: any) => {
          if (o.priceExtra) itemTotal += o.priceExtra
        })
      } catch (e) {}
    }
    return sum + (itemTotal * item.quantity)
  }, 0)

  const deliveryFee = items.length > 0 ? 5 : 0
  const total = subtotal + deliveryFee

  const handleConfirm = () => {
    if (!address) {
      alert("Por favor ingresa una dirección de envío.")
      return
    }
    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      dispatch(clearCart())
      
      // Return to home after animation
      setTimeout(() => {
        navigate('/')
      }, 4000)
    }, 1500)
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-secondary-500 mb-8 max-w-md">Agrega algunas delicias para poder proceder con el pago y envío.</p>
        <Button onClick={() => navigate('/menu')}>Ver el Menú</Button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-secondary-50/50 pb-20">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="w-32 h-32 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20"
            >
              <CheckCircle className="w-16 h-16" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-extrabold text-secondary-800 mb-4 tracking-tight"
            >
              ¡Pedido Confirmado!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-secondary-500 mb-8 max-w-lg leading-relaxed"
            >
              Gracias por comprar en Mister Jugo. En este momento nos ponemos a preparar tus delicias.
            </motion.p>
            
            <motion.div
              initial={{ x: '-100vw', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, delay: 0.6 }}
              className="flex items-center gap-4 px-6 py-4 bg-primary-50 rounded-2xl border-2 border-primary-100 text-primary-700 font-semibold"
            >
              <Bike className="w-6 h-6 animate-bounce" />
              <span>Llegando en ~25 mins</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-500 hover:text-secondary-800 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-800 mb-8 sm:mb-12 tracking-tight">
          Finaliza tu compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Detalles de Envío (Columna Izquierda) */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-secondary-100/50 border border-secondary-100">
              <h2 className="text-xl font-bold text-secondary-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                Detalles de Entrega
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Dirección de Entrega</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Av. Los Fresnos 123, Surco"
                    className="w-full px-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-secondary-800 font-medium placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Referencia (Opcional)</label>
                  <input 
                    type="text" 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej. Casa blanca con rejas negras, frente al parque"
                    className="w-full px-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-secondary-800"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Resumen del Pedido (Columna Derecha) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-secondary-100/50 border border-secondary-100 sticky top-32">
              <h2 className="text-xl font-bold text-secondary-800 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-secondary-800 line-clamp-2 pr-2">{item.product.name}</h4>
                        <span className="font-bold text-secondary-800 whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-500 mt-1">Cant: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t border-secondary-200">
                <div className="flex justify-between text-secondary-600 font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-secondary-600 font-medium">
                  <span>Delivery</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-bold text-secondary-800">Total a Pagar</span>
                  <span className="text-3xl font-extrabold text-primary-500">{formatPrice(total)}</span>
                </div>
              </div>

              <Button 
                onClick={handleConfirm}
                loading={isProcessing}
                size="lg" 
                className="w-full mt-8 shadow-xl shadow-primary-500/20"
              >
                Confirmar Pedido
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
