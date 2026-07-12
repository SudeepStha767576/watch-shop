import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ProductCard from '@/components/ProductCard'
import { api } from '@/lib/api'
import type { Product, Category } from '@/types'

export default function Products() {
  const { categorySlug } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api<{ products: Product[]; category: Category | null }>(`/products?category=${categorySlug}`)
      .then((data) => {
        setProducts(data.products)
        setCategory(data.category)
      })
      .finally(() => setLoading(false))
  }, [categorySlug])

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/watch-shop/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><span className="font-medium">{category?.name ?? categorySlug}</span></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold mt-2">{category?.name ?? 'Products'}</h1>
        <p className="text-sm text-muted-foreground">{products.length} products</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">📦</p>
          <p className="mb-4">No products in this category yet.</p>
          <Link to="/" className="text-accent hover:underline font-semibold">Back to Home</Link>
        </div>
      )}
    </div>
  )
}
