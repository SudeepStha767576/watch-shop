import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

const categories = [
  { name: 'Luxury', slug: 'luxury', icon: '💎' },
  { name: 'Sports', slug: 'sports', icon: '🏃' },
  { name: 'Smart Watches', slug: 'smart-watches', icon: '📱' },
  { name: 'Casual', slug: 'casual', icon: '👔' },
  { name: 'Classic', slug: 'classic', icon: '🕰️' },
  { name: 'Accessories', slug: 'accessories', icon: '🔧' },
]

export default function Navbar() {
  const { user, logout, isAdmin, loading } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className="bg-foreground text-background/80 text-[11px] tracking-wider uppercase font-medium">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          <span className="hidden sm:inline">Free delivery on orders above Rs. 5,000</span>
          <span className="sm:hidden text-[10px]">TimePiece Nepal</span>
          <div className="flex items-center gap-4">
            {!loading && !user && (
              <>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                <Link to="/signup" className="hover:text-white transition-colors">Create Account</Link>
              </>
            )}
            {user && (
              <span className="hidden sm:inline"><User className="h-3 w-3 inline mr-1" />{user.full_name}</span>
            )}
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl group-hover:animate-float">⌚</span>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-foreground">TimePiece</span>
                <span className="text-[10px] text-accent font-bold ml-1 uppercase tracking-widest hidden sm:inline">Nepal</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {isAdmin ? (
                <>
                  <Link to="/admin" className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/admin') ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>Dashboard</Link>
                  <Link to="/admin/products" className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/admin/products') ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>Products</Link>
                  <Link to="/admin/orders" className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/admin/orders') ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>Orders</Link>
                </>
              ) : (
                categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/products/${c.slug}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname === `/products/${c.slug}` ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center gap-1">
              {user && !isAdmin && (
                <>
                  <Link to="/orders" className="hidden sm:inline-flex">
                    <Button variant="ghost" size="sm" className="text-muted-foreground rounded-full">My Orders</Button>
                  </Link>
                  <Link to="/cart" className="relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
                    <ShoppingCart className="h-[18px] w-[18px]" />
                    {count > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold px-1">
                        {count}
                      </span>
                    )}
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:inline-flex rounded-full text-muted-foreground gap-1">
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </Button>
                </>
              )}
              {user && isAdmin && (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:inline-flex rounded-full text-muted-foreground gap-1">
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </Button>
              )}
              {!loading && !user && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login"><Button variant="ghost" size="sm" className="rounded-full">Sign In</Button></Link>
                  <Link to="/signup"><Button size="sm" className="rounded-full bg-accent hover:bg-accent/90 text-white">Get Started</Button></Link>
                </div>
              )}

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger className="lg:hidden ml-1 inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="p-6">
                    <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 mb-6">
                      <span className="text-xl">⌚</span>
                      <span className="font-extrabold text-lg">TimePiece</span>
                    </Link>
                    <div className="space-y-1">
                      {isAdmin ? (
                        <>
                          <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium">Dashboard</Link>
                          <Link to="/admin/products" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium">Products</Link>
                          <Link to="/admin/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium">Orders</Link>
                        </>
                      ) : (
                        <>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-3 py-2">Categories</p>
                          {categories.map((c) => (
                            <Link key={c.slug} to={`/products/${c.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium">
                              <span>{c.icon}</span> {c.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                    <Separator className="my-4" />
                    {user && !isAdmin && (
                      <Link to="/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium">
                        My Orders
                      </Link>
                    )}
                    {!user ? (
                      <div className="space-y-2 mt-2">
                        <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full rounded-full">Sign In</Button></Link>
                        <Link to="/signup" onClick={() => setOpen(false)}><Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-white">Get Started</Button></Link>
                      </div>
                    ) : (
                      <Button variant="ghost" onClick={() => { handleLogout(); setOpen(false) }} className="w-full justify-start gap-2 text-muted-foreground">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
