import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, MapPin, Heart, User, ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../../hooks/useStore'
import { toggleCart } from '../../store/cartSlice'
import logo from '../../assets/logo.png'
import Badge from '../ui/Badge'

export default function Header() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { cart } = useAppSelector((state) => state.cart)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const isMenuPage = location.pathname === '/menu'

  const cartCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    /* Wrapper fijo — cuando hace scroll añade padding lateral y superior para el efecto floating */
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'px-3 sm:px-5 lg:px-8 pt-3' : 'px-0 pt-0'
      }`}
    >
      {/* Barra interior — se redondea y aplica efecto cristal al scrollear */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          scrolled
            ? `bg-white/60 backdrop-blur-2xl border-t border-x border-white/70 ${
                isMenuPage 
                  ? 'rounded-t-2xl border-b-0 shadow-none' 
                  : 'rounded-2xl border-b shadow-2xl shadow-black/[0.08]'
              }`
            : 'bg-white border-b border-secondary-100'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img
                src={logo}
                alt="Mister Jugo"
                className={`object-contain transition-all duration-500 ${
                  scrolled ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-11 sm:h-11'
                }`}
              />
              <span
                className={`font-extrabold text-secondary-800 tracking-tight transition-all duration-500 ${
                  scrolled ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'
                }`}
              >
                Mister <span className="text-primary-500">Jugo</span>
              </span>
            </Link>

            {/* Buscador — desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar hamburguesas, jugos, salchipapas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 text-sm transition-all duration-300
                    text-secondary-800 placeholder:text-secondary-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    scrolled
                      ? 'py-2 bg-white/20 border border-white/40 rounded-xl backdrop-blur-md focus:bg-white/40'
                      : 'py-2.5 bg-secondary-50 border border-secondary-200 rounded-2xl focus:border-primary-500'
                  }`}
                />
              </div>
            </div>

            {/* Acciones — desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors group">
                <MapPin className="w-5 h-5 group-hover:text-primary-500" />
                <span className="text-sm font-medium">Av. Principal 123</span>
              </button>

              <button className="relative p-2 text-secondary-600 hover:text-primary-500 transition-colors rounded-xl hover:bg-white/60">
                <Heart className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 p-2 text-secondary-600 transition-colors rounded-xl">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Invitado</span>
              </div>

              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2.5 text-secondary-600 hover:text-primary-500 transition-colors rounded-xl hover:bg-white/60"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge variant="primary" className="absolute -top-1 -right-1 min-w-[20px] h-5">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </div>

            {/* Acciones — móvil */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 text-secondary-600"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge variant="primary" className="absolute -top-1 -right-1 min-w-[18px] h-4 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-white/60 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden overflow-hidden border-t ${
                scrolled ? 'border-white/30' : 'border-secondary-100'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-2xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-3 py-2 text-secondary-600">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Av. Principal 123, Lima</span>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-secondary-100">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-500 py-2"
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-primary-500 py-2"
                  >
                    Menú
                  </Link>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary-600 py-2">
                    <User className="w-4 h-4" /> Invitado
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
