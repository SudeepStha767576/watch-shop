import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { api, formatPrice, ApiError } from '@/lib/api'
import { toast } from 'sonner'
import type { Product } from '@/types'

export default function ProductDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api<{ product: Product }>(`/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addToCart(product!.id, quantity)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>
  if (!product) return null

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/watch-shop/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/watch-shop/products/${product.category_slug}`}>{product.category_name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><span className="font-medium">{product.name}</span></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 bg-white border rounded-xl p-6">
        <div className="bg-muted rounded-lg overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-[450px] object-contain p-6" />
          ) : (
            <div className="w-full h-[450px] flex items-center justify-center text-7xl text-muted-foreground/30">⌚</div>
          )}
        </div>

        <div className="space-y-4">
          <Badge variant="secondary" className="text-xs uppercase tracking-wider">{product.category_name}</Badge>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-3xl font-extrabold tracking-tight">{formatPrice(product.price)}</p>

          {product.quantity > 0 ? (
            <p className="text-sm font-semibold text-green-600">In Stock ({product.quantity} available)</p>
          ) : (
            <p className="text-sm font-semibold text-destructive">Out of Stock</p>
          )}

          {product.description && (
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {user && !isAdmin && product.quantity > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                <label className="font-semibold text-sm">Qty:</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
                  min={1}
                  max={product.quantity}
                  className="w-20"
                />
              </div>
              <Button onClick={handleAddToCart} disabled={adding} size="lg" className="w-full md:w-auto">
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          )}

          {!user && (
            <div className="pt-4 border-t">
              <Link to="/login"><Button size="lg">Login to Buy</Button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
