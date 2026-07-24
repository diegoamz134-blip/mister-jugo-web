import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
}

export default function Rating({ value, count, size = 'sm' }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
            star <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'fill-secondary-200 text-secondary-200'
          )}
        />
      ))}
      <span className="text-xs font-medium text-secondary-500 ml-1">
        {value.toFixed(1)}
        {count ? ` (${count})` : ''}
      </span>
    </div>
  )
}
