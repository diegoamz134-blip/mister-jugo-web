import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../hooks/useStore'
import { removeToast } from '../../store/uiSlice'

export default function ToastContainer() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.ui.toasts)

  return (
    <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => dispatch(removeToast(toast.id))} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: any; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className={`
        pointer-events-auto flex items-center gap-3.5 px-5 py-3.5 rounded-full shadow-2xl min-w-[280px] w-auto max-w-full
        bg-gray-900/95 backdrop-blur-2xl border border-white/10 text-white
      `}
    >
      <div className="flex-shrink-0">
        {toast.type === 'success' ? (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        ) : null}
        {toast.type === 'error' ? (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400">
            <XCircle className="w-5 h-5" />
          </div>
        ) : null}
        {toast.type === 'info' ? (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400">
            <div className="w-2 h-2 bg-current rounded-full" />
          </div>
        ) : null}
      </div>
      
      <p className="flex-1 text-sm font-semibold tracking-wide">{toast.message}</p>
      
      <button 
        onClick={onClose} 
        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
