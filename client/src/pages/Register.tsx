import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { register, clearError } from '../store/authSlice'
import Button from '../components/ui/Button'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })

  useEffect(() => {
    if (user) navigate('/')
    return () => { dispatch(clearError()) }
  }, [user, navigate, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (register.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row pt-16 sm:pt-20 lg:pt-24">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-800 items-center justify-center p-12 min-h-[200px]">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm">
            <span className="text-white font-extrabold text-2xl sm:text-3xl">MJ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-4">Únete a Mister Jugo</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Crea tu cuenta y disfruta de los mejores productos frescos.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-800">Crear Cuenta</h1>
            <p className="text-sm sm:text-base text-secondary-500 mt-1">Regístrate en Mister Jugo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="+51 999 888 777"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Dirección</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Av. Principal 123"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" loading={loading} className="w-full text-sm sm:text-base" size="lg">
              Crear Cuenta
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-secondary-500 mt-4 sm:mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">
              Inicia Sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
