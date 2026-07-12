export interface User {
  id: number
  username: string
  full_name: string
  email: string
  phone: string
  dob: string
  address: string
  role: 'user' | 'admin'
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  quantity: number
  image: string | null
  image_url: string | null
  category_id: number
  category_name: string
  category_slug: string
  is_active: number
  created_at: string
}

export interface CartItem {
  product_id: number
  name: string
  price: number
  quantity: number
  stock: number
  image: string | null
  image_url: string | null
  is_active: number
  line_total: number
}

export interface Order {
  id: number
  total_amount: number
  status: 'Pending' | 'Paid' | 'Delivered' | 'Cancelled'
  khalti_txn_id: string | null
  created_at: string
}

export interface OrderDetail extends Order {
  khalti_pidx: string | null
  customer: {
    full_name: string
    email: string
    phone: string
    address: string
  }
  items: {
    product_name: string
    price: number
    quantity: number
  }[]
}

export interface ApiResponse {
  success: boolean
  message?: string
}
