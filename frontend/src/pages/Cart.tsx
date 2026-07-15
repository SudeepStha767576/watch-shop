import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, Watch } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/api'
import { toast } from 'sonner'

export default function Cart() {
  const { items, total, loading, updateQuantity, removeItem } = useCart()
  const [editQty, setEditQty] = useState<Record<number, string>>({})

  const commitQty = async (productId: number, stock: number) => {
    const raw = editQty[productId]
    if (raw === undefined) return
    const qty = Math.max(1, Math.min(stock, Number(raw) || 1))
    setEditQty((prev) => { const next = { ...prev }; delete next[productId]; return next })
    try { await updateQuantity(productId, qty) } catch { toast.error('Failed to update') }
  }

  const handleRemove = async (productId: number) => {
    try { await removeItem(productId); toast.success('Item removed') } catch { toast.error('Failed to remove') }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      {items.length > 0 ? (
        <>
          <div className="border rounded-xl divide-y">
            {items.map((item) => (
              <div key={item.product_id} className="flex items-center gap-4 p-4">
                <div className="w-20 h-20 bg-muted/30 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Watch className="h-8 w-8 text-muted-foreground/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                  {!item.is_active && <Badge variant="destructive" className="text-[10px] mt-1">Unavailable</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editQty[item.product_id] ?? item.quantity}
                    onChange={(e) => setEditQty((prev) => ({ ...prev, [item.product_id]: e.target.value }))}
                    onBlur={() => commitQty(item.product_id, item.stock)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitQty(item.product_id, item.stock) }}
                    min={1}
                    max={item.stock}
                    className="w-16 text-center"
                  />
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold">{formatPrice(item.line_total)}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(item.product_id)} className="text-destructive mt-1 h-auto p-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-6">
            <div className="flex justify-between items-center text-xl font-bold pt-2">
              <span>Total:</span>
              <span className="text-amber-700">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Link to="/products"><Button variant="outline">Continue Shopping</Button></Link>
              <Link to="/checkout"><Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Checkout</Button></Link>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Watch className="h-12 w-12 mx-auto mb-4 opacity-15" />
          <p className="text-lg mb-4">Your cart is empty.</p>
          <Link to="/products"><Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">Browse Collection</Button></Link>
        </div>
      )}
    </div>
  )
}
