import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, formatPrice } from '@/lib/api'
import type { OrderDetail } from '@/types'

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-100 text-orange-700',
  Paid: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function Receipt() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ order: OrderDetail }>(`/orders/${orderId}`)
      .then((data) => setOrder(data.order))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <Skeleton className="h-96 max-w-2xl mx-auto" />
  if (!order) return <p className="text-center py-20 text-muted-foreground">Order not found.</p>

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-xl p-8">
      <div className="text-center border-b-2 border-dashed pb-6 mb-6">
        <h2 className="text-xl font-extrabold tracking-tight">TimePiece Nepal</h2>
        <p className="text-xs text-amber-600 uppercase tracking-widest mt-1">Premium Timepieces</p>
        <p className="text-sm text-muted-foreground">Order Receipt</p>
      </div>

      <div className="flex justify-between mb-6 text-sm">
        <div>
          <p><strong>Order #:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Status:</strong> <Badge className={statusColor[order.status]}>{order.status}</Badge></p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{order.customer.full_name}</p>
          <p className="text-muted-foreground">{order.customer.email}</p>
          <p className="text-muted-foreground">{order.customer.phone}</p>
          <p className="text-muted-foreground">{order.customer.address}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{formatPrice(item.price)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center text-xl font-extrabold mt-4 pt-4 border-t-2 border-primary">
        <span>Grand Total:</span>
        <span>{formatPrice(order.total_amount)}</span>
      </div>

      {order.khalti_txn_id && (
        <p className="text-xs text-muted-foreground mt-4">
          <strong>Khalti Transaction ID:</strong> {order.khalti_txn_id}
        </p>
      )}

      <div className="flex justify-center mt-8">
        <Link to="/orders"><Button variant="secondary">Back to Orders</Button></Link>
      </div>
    </div>
  )
}
