import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import PaymentCallback from '@/pages/PaymentCallback'
import Receipt from '@/pages/Receipt'
import OrderHistory from '@/pages/OrderHistory'

import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AddProduct from '@/pages/admin/AddProduct'
import EditProduct from '@/pages/admin/EditProduct'
import AdminOrders from '@/pages/admin/Orders'

export default function App() {
  return (
    <BrowserRouter basename="/watch-shop">
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-callback" element={<PaymentCallback />} />
                  <Route path="/receipt/:orderId" element={<Receipt />} />
                  <Route path="/orders" element={<OrderHistory />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/add" element={<AddProduct />} />
                  <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>

                <Route path="*" element={
                  <div className="text-center py-20">
                    <p className="text-5xl mb-4">404</p>
                    <p className="text-muted-foreground text-lg">Page not found</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors closeButton duration={3000} toastOptions={{ style: { cursor: 'pointer' } }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
