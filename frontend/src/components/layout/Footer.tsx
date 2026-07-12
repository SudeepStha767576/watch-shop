import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const categories = [
  { name: 'Luxury', slug: 'luxury' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Smart Watches', slug: 'smart-watches' },
  { name: 'Casual', slug: 'casual' },
  { name: 'Classic', slug: 'classic' },
  { name: 'Accessories', slug: 'accessories' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1f] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⌚</span>
              <span className="text-lg font-extrabold tracking-tight">TimePiece</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Nepal</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nepal's trusted destination for premium timepieces. Authentic watches from world-renowned brands.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500 mb-5">Shop</h4>
            <div className="flex flex-col gap-3">
              {categories.map((c) => (
                <Link key={c.slug} to={`/products/${c.slug}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500 mb-5">Account</h4>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="text-sm text-slate-400 hover:text-white transition-colors">Create Account</Link>
              <Link to="/orders" className="text-sm text-slate-400 hover:text-white transition-colors">My Orders</Link>
              <Link to="/cart" className="text-sm text-slate-400 hover:text-white transition-colors">Shopping Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500 mb-5">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <p>Kathmandu, Nepal</p>
              <p>+977-9800000000</p>
              <p>info@timepiecenepal.com</p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TimePiece Nepal. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">Powered by</span>
            <span className="text-xs font-semibold text-slate-400">Khalti</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
