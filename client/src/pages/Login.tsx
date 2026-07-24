import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { login, clearError } from '../store/authSlice'
import Button from '../components/ui/Button'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('camila@email.com')
  const [password, setPassword] = useState('123456')

  useEffect(() => {
    if (user) navigate('/')
    return () => { dispatch(clearError()) }
  }, [user, navigate, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row pt-16 sm:pt-20 lg:pt-24">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-800">Iniciar Sesión</h1>
            <p className="text-sm sm:text-base text-secondary-500 mt-1">Ingresa a tu cuenta de Mister Jugo</p>
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
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm
                  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1 sm:mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-xs sm:text-sm pr-10 sm:pr-12
                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full text-sm sm:text-base" size="lg">
              Iniciar Sesión
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-secondary-500 mt-4 sm:mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600">
              Regístrate
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-800 items-center justify-center p-12 order-1 lg:order-2 min-h-[200px] lg:min-h-0">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm">
            <span className="text-white font-extrabold text-2xl sm:text-3xl">MJ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-4">Bienvenido a Mister Jugo</h2>
          <p className="text-white/80 text-base sm:text-lg">
            La mejor comida rápida y jugos frescos, al alcance de un clic.
          </p>
        </div>
      </div>
    </div>
  )
}
