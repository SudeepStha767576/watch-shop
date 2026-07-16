import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ShoppingBag, TrendingUp, Clock, Plus, ArrowRight, Watch } from 'lucide-react'
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

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-64 mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div>
    </div>
  )

  const cards = [
    { label: 'Total Products', value: stats?.total_products ?? 0, icon: Package, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-500', format: false },
    { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: ShoppingBag, color: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-emerald-500', format: false },
    { label: 'Revenue', value: stats?.total_revenue ?? 0, icon: TrendingUp, color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-500', format: true },
    { label: 'Pending Delivery', value: stats?.pending_delivery ?? 0, icon: Clock, color: 'from-orange-500/10 to-orange-600/5', iconColor: 'text-orange-500', format: false },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Watch className="h-5 w-5 text-amber-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold">Hi, {user?.full_name}!</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your store overview</p>
        </div>
        <Link to="/admin/products/add">
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl bg-gradient-to-br ${c.color} border p-5`}>
            <c.icon className={`h-5 w-5 ${c.iconColor} mb-3`} />
            <p className="text-2xl font-bold tracking-tight">
              {c.format ? formatPrice(c.value) : c.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="group flex items-center justify-between rounded-xl border p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
          <div>
            <h3 className="font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-muted-foreground">Edit, delist, or update inventory</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link to="/admin/orders" className="group flex items-center justify-between rounded-xl border p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
          <div>
            <h3 className="font-semibold mb-1">View Orders</h3>
            <p className="text-sm text-muted-foreground">Track and manage customer orders</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link to="/admin/users" className="group flex items-center justify-between rounded-xl border p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
          <div>
            <h3 className="font-semibold mb-1">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View and manage user accounts</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  )
}
