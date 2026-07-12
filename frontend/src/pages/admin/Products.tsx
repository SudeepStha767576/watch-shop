import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api, formatPrice } from '@/lib/api'
import { toast } from 'sonner'
import type { Product } from '@/types'

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

  if (loading) return <Skeleton className="h-96" />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link to="/admin/products/add"><Button>+ Add Product</Button></Link>
      </div>

      {products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-12 h-12 object-contain rounded bg-muted p-1" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">⌚</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category_name}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>
                  <Badge className={p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {p.is_active ? 'Active' : 'Delisted'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/edit/${p.id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant={p.is_active ? 'destructive' : 'default'} size="sm">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-4">No products yet.</p>
          <Link to="/admin/products/add"><Button>Add Product</Button></Link>
        </div>
      )}
    </div>
  )
}
