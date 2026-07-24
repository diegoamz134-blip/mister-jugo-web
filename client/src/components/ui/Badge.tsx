import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full',
        {
          'bg-primary-500 text-white': variant === 'primary',
          'bg-green-500 text-white': variant === 'success',
          'bg-secondary-100 text-secondary-700': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
