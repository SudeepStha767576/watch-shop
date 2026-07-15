import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/ProductCard'
import { api } from '@/lib/api'
import type { Product } from '@/types'
import { ArrowRight, Watch, Shield, Truck, CreditCard } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ products: Product[] }>('/products/featured')
      .then((data) => setFeatured(data.products))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero - full width dark */}
      <section className="relative bg-[#0a0f1f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,134,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,27,61,0.8),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-12 bg-amber-500" />
                <span className="text-amber-400 text-xs uppercase tracking-[0.3em] font-semibold">Est. 2024</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
                Time is
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">precious.</span>
              </h1>
              <p className="text-white/50 text-lg md:text-xl mb-10 max-w-md leading-relaxed">
                Curated collection of premium timepieces. From classic elegance to modern innovation.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4"
            >
              <Link to="/products">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 h-12">
                  Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Decorative watch icon */}
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.06, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Watch className="h-80 w-80 text-amber-400" strokeWidth={0.5} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#0d1428] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="h-5 w-5" />, title: 'Free Delivery', desc: 'Orders above Rs. 5,000' },
              { icon: <Shield className="h-5 w-5" />, title: 'Genuine Products', desc: 'Manufacturer warranty' },
              { icon: <CreditCard className="h-5 w-5" />, title: 'Secure Payment', desc: 'Khalti digital wallet' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <div className="text-amber-500">{item.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-[0.2em] font-semibold mb-2">New In</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Arrivals</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[340px] rounded-xl" />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Watch className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg">No products available yet. Check back soon!</p>
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link to="/products">
            <Button variant="outline" className="rounded-full">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
