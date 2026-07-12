import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api, formatPrice } from '@/lib/api'
import { toast } from 'sonner'

interface AdminOrder {
  id: number
  full_name: string
  phone: string
  total_amount: number
  status: string
  created_at: string
}

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-100 text-orange-700',
  Paid: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
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

  if (loading) return <Skeleton className="h-96" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Orders</h1>

      {orders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">#{o.id}</TableCell>
                <TableCell>{o.full_name}</TableCell>
                <TableCell>{o.phone}</TableCell>
                <TableCell>{formatPrice(o.total_amount)}</TableCell>
                <TableCell>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                <TableCell><Badge className={statusColor[o.status]}>{o.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/receipt/${o.id}`}><Button variant="outline" size="sm">View</Button></Link>
                    {o.status === 'Paid' && (
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button size="sm">Mark Delivered</Button>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No orders yet.</p>
        </div>
      )}
    </div>
  )
}
