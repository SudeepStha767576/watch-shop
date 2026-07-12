import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'

export default function PaymentCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')

  useEffect(() => {
    const pidx = params.get('pidx')
    if (!pidx) {
      toast.error('Invalid payment response')
      navigate('/cart')
      return
    }

    api<{ order_id: number; status: string }>(`/payment/verify?pidx=${pidx}`)
      .then(async (data) => {
        setStatus('success')
        await refreshCart()
        toast.success('Payment successful!')
        setTimeout(() => navigate(`/receipt/${data.order_id}`), 1500)
      })
      .catch((err) => {
        setStatus('failed')
        toast.error(err instanceof ApiError ? err.message : 'Payment verification failed')
        setTimeout(() => navigate('/cart'), 2000)
      })
  }, [params, navigate, refreshCart])

  return (
    <div className="text-center py-20">
      {status === 'verifying' && (
        <>
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Verifying your payment...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait, do not close this page.</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="text-5xl mb-4">✅</div>
          <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to your receipt...</p>
        </>
      )}
      {status === 'failed' && (
        <>
          <div className="text-5xl mb-4">❌</div>
          <p className="text-lg font-semibold text-destructive">Payment Failed</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to cart...</p>
        </>
      )}
    </div>
  )
}
