import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'
import type { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  total: number
  count: number
  loading: boolean
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!user || isAdmin) {
      setItems([])
      setTotal(0)
      setCount(0)
      return
    }
    setLoading(true)
    try {
      const data = await api<{ items: CartItem[]; total: number; count: number }>('/cart')
      setItems(data.items)
      setTotal(data.total)
      setCount(data.count)
    } catch {
      setItems([])
      setTotal(0)
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [user, isAdmin])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = async (productId: number, quantity: number) => {
    await api('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
    await refreshCart()
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    await api('/cart', {
      method: 'PUT',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
    await refreshCart()
  }

  const removeItem = async (productId: number) => {
    await api(`/cart/${productId}`, { method: 'DELETE' })
    await refreshCart()
  }

  return (
    <CartContext.Provider value={{ items, total, count, loading, addToCart, updateQuantity, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
