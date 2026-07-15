import { Link } from 'react-router-dom'
import { Watch } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1f] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Watch className="h-5 w-5 text-amber-400" />
              <span className="text-lg font-bold">Time<span className="text-amber-400">Piece</span></span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Nepal's trusted destination for premium timepieces. Authentic watches with manufacturer warranty.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white/30 mb-5">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/products" className="text-sm text-white/50 hover:text-amber-400 transition-colors">Collection</Link>
              <Link to="/orders" className="text-sm text-white/50 hover:text-amber-400 transition-colors">My Orders</Link>
              <Link to="/cart" className="text-sm text-white/50 hover:text-amber-400 transition-colors">Cart</Link>
              <Link to="/login" className="text-sm text-white/50 hover:text-amber-400 transition-colors">Sign In</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white/30 mb-5">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-white/50">
              <p>Kathmandu, Nepal</p>
              <p>+977-9800000000</p>
              <p>info@timepiecenepal.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">&copy; {new Date().getFullYear()} TimePiece Nepal</p>
          <span className="text-xs text-white/25">Payments by Khalti</span>
        </div>
      </div>
    </footer>
  )
}
