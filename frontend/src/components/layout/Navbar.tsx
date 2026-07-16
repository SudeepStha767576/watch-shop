import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, LogOut, Watch, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

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
    <nav className="sticky top-0 z-50 bg-[#0a0f1f]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Watch className="h-6 w-6 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-bold tracking-tight text-white">
              Time<span className="text-amber-400">Piece</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isAdmin ? (
              <>
                <Link to="/admin" className={`text-sm font-medium transition-colors ${isActive('/admin') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Dashboard</Link>
                <Link to="/admin/products" className={`text-sm font-medium transition-colors ${isActive('/admin/products') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Products</Link>
                <Link to="/admin/orders" className={`text-sm font-medium transition-colors ${isActive('/admin/orders') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Orders</Link>
                <Link to="/admin/users" className={`text-sm font-medium transition-colors ${isActive('/admin/users') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Users</Link>
              </>
            ) : (
              <>
                <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Home</Link>
                <Link to="/products" className={`text-sm font-medium transition-colors ${isActive('/products') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>Collection</Link>
                {user && <Link to="/orders" className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-amber-400' : 'text-white/60 hover:text-white'}`}>My Orders</Link>}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user && !isAdmin && (
              <>
                <Link to="/cart" className="relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors">
                  <ShoppingCart className="h-[18px] w-[18px] text-white/70" />
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1">
                      {count}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <User className="h-3.5 w-3.5" />
                    <span>{user.full_name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50 hover:text-white hover:bg-white/10 gap-1">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
            {user && isAdmin && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <User className="h-3.5 w-3.5" />
                  <span>{user.full_name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50 hover:text-white hover:bg-white/10 gap-1">
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </Button>
              </div>
            )}
            {!loading && !user && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login"><Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">Sign In</Button></Link>
                <Link to="/signup"><Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">Sign Up</Button></Link>
              </div>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="md:hidden ml-1 inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/10 transition-colors">
                <Menu className="h-5 w-5 text-white" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#0a0f1f] border-white/10 p-0">
                <div className="p-6">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 mb-8">
                    <Watch className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-lg text-white">Time<span className="text-amber-400">Piece</span></span>
                  </Link>
                  <div className="space-y-1">
                    {isAdmin ? (
                      <>
                        <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Dashboard</Link>
                        <Link to="/admin/products" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Products</Link>
                        <Link to="/admin/orders" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Orders</Link>
                        <Link to="/admin/users" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Users</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Home</Link>
                        <Link to="/products" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">Collection</Link>
                        {user && <Link to="/orders" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium">My Orders</Link>}
                      </>
                    )}
                  </div>
                  <Separator className="my-6 bg-white/10" />
                  {!user ? (
                    <div className="space-y-2">
                      <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Sign In</Button></Link>
                      <Link to="/signup" onClick={() => setOpen(false)}><Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">Sign Up</Button></Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-white/70 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{user.full_name}</span>
                      </div>
                      <Button variant="ghost" onClick={() => { handleLogout(); setOpen(false) }} className="w-full justify-start gap-2 text-white/50 hover:text-white hover:bg-white/10">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
