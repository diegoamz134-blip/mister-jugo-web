import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mister Jugo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-extrabold">
                Mister <span className="text-primary-500">Jugo</span>
              </span>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed mb-6">
              La mejor comida rápida y jugos naturales frescos. 
              Preparados al momento con ingredientes de la más alta calidad.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/misterjugoica/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary-800 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/misterjugoica/?hl=es" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary-800 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Menú</h3>
            <ul className="space-y-3">
              {['Hamburguesas', 'Salchipapas', 'Jugos Frescos', 'Combos', 'Promociones'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-secondary-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {['Preguntas Frecuentes', 'Términos y Condiciones', 'Política de Privacidad', 'Libro de Reclamaciones'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-secondary-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-secondary-400 text-sm">Av. Margarita 120, Ica, Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-secondary-400 text-sm">+51 999 888 777</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-secondary-400 text-sm">hola@misterjugo.pe</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-500 text-sm">
            © 2024 Mister Jugo. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {['Pago seguro', 'Delivery 30 min', 'Productos frescos'].map((item) => (
              <span key={item} className="text-secondary-500 text-xs">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
