import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Category } from '../../types'

import alitasImg from '../../assets/alitas.png'
import almuerzosImg from '../../assets/almuerzos.png'
import ensaladasImg from '../../assets/ensaladas.png'
import hamburgesasImg from '../../assets/hamburgesas.png'
import jugosImg from '../../assets/jugos.png'
import salchipapasImg from '../../assets/salchipapas.png'
import sandwichImg from '../../assets/sandwich.png'

const categoryImages: Record<string, string> = {
  hamburguesas: hamburgesasImg,
  salchipapas: salchipapasImg,
  'jugos-frescos': jugosImg,
  alitas: alitasImg,
  almuerzos: almuerzosImg,
  ensaladas: ensaladasImg,
  sandwich: sandwichImg,
  combos: hamburgesasImg,
}

interface CategoryCarouselProps {
  categories: Category[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const navigate = useNavigate()
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const pause = () => setPaused(true)
    const resume = () => setPaused(false)

    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume, { passive: true })
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)

    return () => {
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [])

  if (categories.length === 0) return null

  const duration = Math.max(categories.length * 6, 20)

  const duplicated = [...categories, ...categories]

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="overflow-hidden rounded-2xl sm:rounded-[2rem]"
      >
        <div
          className="flex gap-4 sm:gap-5 will-change-transform"
          style={{
            width: 'max-content',
            animation: `scroll-categories ${duration}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {duplicated.map((cat, i) => (
            <button
              key={`${cat.id}-${i}`}
              onClick={() => navigate(`/menu?categoria=${cat.slug}`)}
              className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl group"
              style={{
                width: 'clamp(160px, 22vw, 290px)',
                height: 'clamp(190px, 27vw, 350px)',
              }}
            >
              <img
                src={categoryImages[cat.slug] || cat.image || hamburgesasImg}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 text-left">
                <h3 className="font-bold text-white text-lg sm:text-xl md:text-2xl leading-tight break-words">
                  {cat.name}
                </h3>
                {cat._count && (
                  <p className="text-white/60 text-xs sm:text-sm md:text-base mt-1">
                    {cat._count.products} productos
                  </p>
                )}
              </div>
              <span className="absolute top-3 sm:top-5 right-3 sm:right-5 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 rounded-l-2xl sm:rounded-l-[2rem]" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 rounded-r-2xl sm:rounded-r-[2rem]" />

      <style>{`
        @keyframes scroll-categories {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
