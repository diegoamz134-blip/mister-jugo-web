import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, LogOut, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { logout } from '../store/authSlice'
import Button from '../components/ui/Button'
import api from '../services/api'

export default function Profile() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/orders').then((res) => { setOrders(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  if (!user) return null

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    DELIVERING: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    DELIVERING: 'En camino',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  }

  return (
    <div className="min-h-screen bg-secondary-50 pt-16 sm:pt-20 lg:pt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-80 xl:w-96"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-secondary-100">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-primary-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-secondary-800">{user.name}</h2>
                <p className="text-xs sm:text-sm text-secondary-500 capitalize">{user.role.toLowerCase()}</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-secondary-50">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-secondary-700 truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-secondary-50">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-secondary-700">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-secondary-50">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-secondary-700">{user.address}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full mt-4 sm:mt-6 gap-2 text-red-500 border-red-200 hover:bg-red-50 text-sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-secondary-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                <h2 className="text-lg sm:text-xl font-bold text-secondary-800">Mis Pedidos</h2>
              </div>

              {loading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 sm:h-24 rounded-2xl bg-secondary-100 animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-secondary-300 mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-1">Sin pedidos aún</h3>
                  <p className="text-xs sm:text-sm text-secondary-500">Tus pedidos aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-3 sm:p-4 rounded-2xl bg-secondary-50 border border-secondary-100">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-secondary-800">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-secondary-500">
                            {new Date(order.createdAt).toLocaleDateString('es-PE', {
                              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {order.items.slice(0, 3).map((item: any) => (
                            <span key={item.id} className="text-[10px] sm:text-xs text-secondary-600 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                              {item.quantity}x {item.product.name}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-[10px] sm:text-xs text-secondary-400">+{order.items.length - 3} más</span>
                          )}
                        </div>
                        <span className="font-bold text-secondary-800 text-xs sm:text-sm">
                          S/ {Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
