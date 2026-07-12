import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, formatPrice } from '@/lib/api'
import type { Order } from '@/types'

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-100 text-orange-700',
  Paid: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ orders: Order[] }>('/orders')
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold border-b pb-4">My Orders</h1>

      {orders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                <TableCell><Badge className={statusColor[order.status]}>{order.status}</Badge></TableCell>
                <TableCell>
                  {(order.status === 'Paid' || order.status === 'Delivered') && (
                    <Link to={`/receipt/${order.id}`}><Button variant="outline" size="sm">View Receipt</Button></Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg mb-4">You haven't placed any orders yet.</p>
          <Link to="/"><Button>Start Shopping</Button></Link>
        </div>
      )}
    </div>
  )
}
