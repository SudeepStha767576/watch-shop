import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ShoppingBag, DollarSign, Truck } from 'lucide-react'
import { api, formatPrice } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface Stats {
  total_products: number
  total_orders: number
  total_revenue: number
  pending_delivery: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ stats: Stats }>('/admin/stats')
      .then((data) => setStats(data.stats))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.full_name}!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6 text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-3xl font-extrabold">{stats?.total_products}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Products</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-3xl font-extrabold">{stats?.total_orders}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Orders</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-extrabold">{formatPrice(stats?.total_revenue ?? 0)}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Revenue</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6 text-center">
            <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-3xl font-extrabold">{stats?.pending_delivery}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">To Deliver</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link to="/admin/products/add"><Button>Add New Product</Button></Link>
        <Link to="/admin/products"><Button variant="secondary">Manage Products</Button></Link>
        <Link to="/admin/orders"><Button variant="secondary">View Orders</Button></Link>
      </div>
    </div>
  )
}
