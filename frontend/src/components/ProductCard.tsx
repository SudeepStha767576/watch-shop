import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/api'
import type { Product } from '@/types'
import { Watch } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {product.quantity <= 0 && (
          <Badge variant="destructive" className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-wider">
            Out of Stock
          </Badge>
        )}

        <div className="aspect-square bg-muted/30 overflow-hidden flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Watch className="h-16 w-16 text-muted-foreground/15" />
          )}
        </div>

        <div className="p-4">
          {product.category_name && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-amber-600 font-semibold mb-1">{product.category_name}</p>
          )}
          <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-base font-bold">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  )
}
