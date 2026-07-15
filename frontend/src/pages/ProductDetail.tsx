import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { api, formatPrice, ApiError } from '@/lib/api'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { ArrowLeft, Watch } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [qtyInput, setQtyInput] = useState('1')
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

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-12 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>
  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center aspect-square">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-10" />
          ) : (
            <Watch className="h-24 w-24 text-muted-foreground/15" />
          )}
        </div>

        <div className="flex flex-col justify-center space-y-5">
          {product.category_name && (
            <p className="text-xs uppercase tracking-[0.15em] text-amber-600 font-semibold">{product.category_name}</p>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-3xl font-bold text-amber-700">{formatPrice(product.price)}</p>

          {product.quantity > 0 ? (
            <p className="text-sm font-medium text-green-600">In Stock ({product.quantity} available)</p>
          ) : (
            <p className="text-sm font-medium text-destructive">Out of Stock</p>
          )}

          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          )}

          {user && !isAdmin && product.quantity > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <label className="font-medium text-sm">Qty:</label>
                <Input
                  type="number"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  onBlur={() => { const v = Math.max(1, Math.min(product.quantity, Number(qtyInput) || 1)); setQuantity(v); setQtyInput(String(v)) }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { const v = Math.max(1, Math.min(product.quantity, Number(qtyInput) || 1)); setQuantity(v); setQtyInput(String(v)) } }}
                  min={1}
                  max={product.quantity}
                  className="w-20"
                />
              </div>
              <Button onClick={handleAddToCart} disabled={adding} size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold w-full md:w-auto px-10">
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          )}

          {!user && (
            <div className="pt-4 border-t">
              <Link to="/login"><Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Login to Buy</Button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
