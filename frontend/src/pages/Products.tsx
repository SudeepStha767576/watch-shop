import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import ProductCard from '@/components/ProductCard'
import { api } from '@/lib/api'
import type { Product } from '@/types'
import { Search, Watch } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api<{ products: Product[] }>('/products')
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-amber-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Our Collection</p>
          <h1 className="text-3xl font-bold">All Watches</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} timepieces</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search watches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-[340px] rounded-xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Watch className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="mb-4">{search ? 'No watches match your search.' : 'No products available yet.'}</p>
          {search && (
            <button onClick={() => setSearch('')} className="text-amber-600 hover:underline font-semibold text-sm">Clear search</button>
          )}
          {!search && <Link to="/" className="text-amber-600 hover:underline font-semibold">Back to Home</Link>}
        </div>
      )}
    </div>
  )
}
