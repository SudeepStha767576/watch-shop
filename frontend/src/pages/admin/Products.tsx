import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api, formatPrice } from '@/lib/api'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { Plus, Pencil, Watch } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    api<{ products: Product[] }>('/admin/products')
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false))
  }

  useEffect(fetchProducts, [])

  const handleToggle = async (id: number) => {
    try {
      const data = await api<{ is_active: number }>(`/admin/products/${id}/toggle`, { method: 'PATCH' })
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: data.is_active } : p))
      toast.success('Product status updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-12"><Skeleton className="h-96" /></div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total</p>
        </div>
        <Link to="/admin/products/add">
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/30 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-muted/50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-full h-full object-contain p-1" />
                ) : (
                  <Watch className="h-6 w-6 text-muted-foreground/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{p.category_name}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatPrice(p.price)}</span>
                  <span>Stock: {p.quantity}</span>
                  <Badge className={`text-[10px] ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.is_active ? 'Active' : 'Delisted'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/admin/products/edit/${p.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant={p.is_active ? 'outline' : 'default'} size="sm" className="text-xs h-8">
                      {p.is_active ? 'Delist' : 'Relist'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{p.is_active ? 'Delist' : 'Relist'} Product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {p.is_active ? 'This product will be hidden from the shop.' : 'This product will be visible in the shop again.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleToggle(p.id)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Watch className="h-12 w-12 mx-auto mb-4 opacity-15" />
          <p className="text-lg mb-4">No products yet.</p>
          <Link to="/admin/products/add"><Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">Add Product</Button></Link>
        </div>
      )}
    </div>
  )
}
