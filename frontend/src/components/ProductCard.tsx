import { Link } from 'react-router-dom'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/api'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <CardContainer containerClassName="py-0">
        <CardBody className="relative group/card w-full h-auto rounded-2xl border bg-card p-4 hover:shadow-xl transition-shadow duration-300">
          {product.quantity <= 0 && (
            <Badge variant="destructive" className="absolute top-6 left-6 z-10 text-[10px] uppercase tracking-wider">
              Out of Stock
            </Badge>
          )}

          <CardItem translateZ="50" className="w-full">
            <div className="w-full h-52 rounded-xl bg-muted/50 overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover/card:scale-110 transition-transform duration-500"
                />
              ) : (
                <span className="text-5xl opacity-20">⌚</span>
              )}
            </div>
          </CardItem>

          <CardItem translateZ="30" className="w-full mt-4">
            {product.category_name && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{product.category_name}</p>
            )}
          </CardItem>

          <CardItem translateZ="40" className="w-full mt-1">
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover/card:text-accent transition-colors">
              {product.name}
            </h3>
          </CardItem>

          <CardItem translateZ="50" className="w-full mt-3 flex items-center justify-between">
            <span className="text-base font-bold">{formatPrice(product.price)}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-hover/card:text-accent transition-colors">
              View →
            </span>
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  )
}
