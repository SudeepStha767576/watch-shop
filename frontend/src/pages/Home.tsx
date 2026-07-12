import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FlipWords } from '@/components/ui/flip-words'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { Spotlight } from '@/components/ui/spotlight'
import ProductCard from '@/components/ProductCard'
import { api } from '@/lib/api'
import type { Product, Category } from '@/types'
import { ArrowRight, Shield, Truck, CreditCard } from 'lucide-react'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api<{ categories: Category[] }>('/categories'),
      api<{ products: Product[] }>('/products/featured'),
    ]).then(([catData, prodData]) => {
      setCategories(catData.categories)
      setFeatured(prodData.products)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[520px] flex items-center justify-center rounded-3xl overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(184,134,11,0.3)" />
        <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-6 font-medium">Premium Timepieces</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Discover Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              <FlipWords words={['Luxury Watch', 'Smart Watch', 'Sports Watch', 'Classic Watch']} duration={2500} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Nepal's most trusted watch store. Authentic timepieces from world-renowned brands, delivered to your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products/luxury">
              <Button size="lg" className="rounded-full bg-white text-slate-950 hover:bg-white/90 font-bold text-base px-8 h-12 shadow-xl shadow-white/10">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#categories">
              <Button size="lg" variant="outline" className="rounded-full border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white font-medium text-base px-8 h-12">
                Browse Categories
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-blue-900/15 rounded-full blur-[100px]" />
      </section>

      {/* Trust Badges */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Truck className="h-6 w-6" />, title: 'Free Delivery', desc: 'On orders above Rs. 5,000 within KTM valley' },
            { icon: <Shield className="h-6 w-6" />, title: 'Authentic Products', desc: '100% genuine watches with manufacturer warranty' },
            { icon: <CreditCard className="h-6 w-6" />, title: 'Secure Payment', desc: 'Pay safely with Khalti digital wallet' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex items-center gap-4 p-5 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories">
        <div className="text-center mb-10">
          <TextGenerateEffect words="Shop by Category" className="text-3xl md:text-4xl font-extrabold tracking-tight" duration={0.3} />
          <p className="text-muted-foreground mt-3 text-lg">Find the perfect timepiece for every occasion</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <Link key={cat.id} to={`/products/${cat.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.07 * i }}
                  className="group relative h-48 md:h-56 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-[#0f1b3d] to-[#1a2a5e]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="text-8xl">⌚</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg md:text-xl tracking-wide">{cat.name}</h3>
                    <p className="text-white/60 text-xs mt-1 group-hover:text-amber-300/80 transition-colors flex items-center gap-1">
                      Shop now <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <TextGenerateEffect words="Latest Arrivals" className="text-3xl md:text-4xl font-extrabold tracking-tight" duration={0.3} />
            <p className="text-muted-foreground mt-2 text-lg">Fresh drops you don't want to miss</p>
          </div>
          <Link to="/products/luxury" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[380px] rounded-2xl" />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.06 * i }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-5xl mb-4 opacity-30">⌚</p>
            <p className="text-lg">No products available yet. Check back soon!</p>
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link to="/products/luxury">
            <Button variant="outline" className="rounded-full">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
