import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api, formatPrice } from '@/lib/api'
import { toast } from 'sonner'
import { Eye, Truck } from 'lucide-react'

interface AdminOrder {
  id: number
  full_name: string
  phone: string
  total_amount: number
  status: string
  created_at: string
}

const statusStyle: Record<string, string> = {
  Pending: 'bg-orange-100 text-orange-700',
  Paid: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ orders: AdminOrder[] }>('/admin/orders')
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  const handleDeliver = async (id: number) => {
    try {
      await api(`/admin/orders/${id}/deliver`, { method: 'PATCH' })
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'Delivered' } : o))
      toast.success(`Order #${id} marked as Delivered`)
    } catch {
      toast.error('Failed to update order')
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-12"><Skeleton className="h-96" /></div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total</p>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-sm">#{o.id}</span>
                  <Badge className={`text-[10px] ${statusStyle[o.status]}`}>{o.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{o.full_name}</span>
                  <span>{o.phone}</span>
                  <span className="font-semibold text-foreground">{formatPrice(o.total_amount)}</span>
                  <span>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/receipt/${o.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                </Link>
                {o.status === 'Paid' && (
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="sm" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                        <Truck className="h-3 w-3" /> Deliver
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as Delivered?</AlertDialogTitle>
                        <AlertDialogDescription>This will update Order #{o.id} status to Delivered.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeliver(o.id)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No orders yet.</p>
        </div>
      )}
    </div>
  )
}
