import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import alitasImg from '../../assets/alitas.png'
import almuerzosImg from '../../assets/almuerzos.png'
import ensaladasImg from '../../assets/ensaladas.png'
import hamburgesasImg from '../../assets/hamburgesas.png'
import jugosImg from '../../assets/jugos.png'
import salchipapasImg from '../../assets/salchipapas.png'
import sandwichImg from '../../assets/sandwich.png'

const slides = [
  {
    image: hamburgesasImg,
    imageMobile: hamburgesasImg,
    title: 'HAMBURGUESAS ARTESANALES',
    subtitle: 'Las mejores hamburguesas con ingredientes frescos y salsa de la casa.',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: salchipapasImg,
    imageMobile: salchipapasImg,
    title: 'SALCHIPAPAS CROCANTES',
    subtitle: 'Papas fritas con salchichas doradas y nuestra salsa especial.',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: jugosImg,
    imageMobile: jugosImg,
    title: 'JUGOS NATURALES FRESCOS',
    subtitle: 'Hechos al momento con frutas seleccionadas. Pura vitamina.',
    gradient: 'from-black/70 via-black/40 to-transparent',
  },
  {
    image: alitasImg,
    imageMobile: alitasImg,
    title: 'ALITAS ACEVICHADAS',
    subtitle: 'Crujientes alitas bañadas en nuestra deliciosa salsa acevichada. ¡Pruébalas!',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: almuerzosImg,
    imageMobile: almuerzosImg,
    title: 'ALMUERZOS EJECUTIVOS',
    subtitle: 'Menú completo del día a un precio especial.',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: ensaladasImg,
    imageMobile: ensaladasImg,
    title: 'ENSALADAS FRESCAS',
    subtitle: 'Opción saludable con ingredientes frescos y aliños naturales.',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: sandwichImg,
    imageMobile: sandwichImg,
    title: 'SANDWICH GOURMET',
    subtitle: 'Sandwich artesanales con pan fresco y los mejores ingredientes.',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
  {
    image: hamburgesasImg,
    imageMobile: hamburgesasImg,
    title: 'COMBOS FAMILIARES',
    subtitle: 'Combos para compartir con toda la familia. ¡Ahorra más!',
    gradient: 'from-black/70 via-black/50 to-transparent',
  },
]

export default function HeroBanner() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])

  return (
    <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden mx-auto max-w-[1440px] mt-14 sm:mt-16 lg:mt-24 mx-4 sm:mx-6 lg:mx-auto rounded-none sm:rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <picture>
            <source media="(max-width: 640px)" srcSet={slides[current].imageMobile} />
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </picture>
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="px-6 sm:px-10 md:px-16 max-w-xl sm:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                {slides[current].title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
                {slides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button size="lg" className="shadow-2xl w-full sm:w-auto text-sm sm:text-base" onClick={() => navigate('/menu')}>
              Ordenar Ahora
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 shadow-2xl w-full sm:w-auto text-sm sm:text-base" onClick={() => navigate('/menu')}>
              Ver Menú
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6 sm:w-8' : 'bg-white/40 hover:bg-white/60 w-2 sm:w-2.5'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}