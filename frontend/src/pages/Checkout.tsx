import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { api, formatPrice, ApiError } from '@/lib/api'
import { toast } from 'sonner'

export default function Checkout() {
  const { user } = useAuth()
  const { items, total, loading: cartLoading } = useCart()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!cartLoading && items.length === 0) navigate('/cart')
  }, [cartLoading, items, navigate])

  const hasIssue = items.some((i) => !i.is_active || i.quantity > i.stock)

  const handlePay = async () => {
    setPaying(true)
    try {
      const data = await api<{ payment_url: string; order_id: number }>('/checkout', { method: 'POST' })
      window.location.href = data.payment_url
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Checkout failed')
      setPaying(false)
    }
  }

  if (cartLoading) return <Skeleton className="h-64" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold border-b pb-4">Checkout</h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
        <div>
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="bg-white border rounded-xl divide-y">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} × {item.quantity}</p>
                </div>
                <p className="font-bold">{formatPrice(item.line_total)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 font-extrabold text-lg">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Delivery Details</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Name:</strong> {user?.full_name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Address:</strong> {user?.address}</p>
            </CardContent>
          </Card>

          {hasIssue ? (
            <>
              <Alert variant="destructive"><AlertDescription>Some items have issues. Please update your cart.</AlertDescription></Alert>
              <Button variant="outline" className="w-full" onClick={() => navigate('/cart')}>Go to Cart</Button>
            </>
          ) : (
            <>
              <Button onClick={handlePay} disabled={paying} size="lg" className="w-full text-base py-6">
                {paying ? 'Redirecting to Khalti...' : `Pay ${formatPrice(total)} with Khalti`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">You will be redirected to Khalti to complete payment.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
