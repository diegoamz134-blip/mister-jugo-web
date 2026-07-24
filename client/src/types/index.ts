export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  image?: string
  role: 'USER' | 'ADMIN'
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image?: string
  color: string
  order: number
  _count?: { products: number }
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discountPrice?: number
  image: string
  images: string[]
  rating: number
  ratingCount: number
  prepTime: number
  categoryId: string
  category: Category
  featured: boolean
  active: boolean
}

export interface ProductOptionGroup {
  id: string
  productId: string
  name: string
  type: 'radio' | 'checkbox'
  required: boolean
  order: number
  options: ProductOption[]
}

export interface ProductOption {
  id: string
  groupId: string
  name: string
  priceExtra: number
  isDefault: boolean
  order: number
  active: boolean
}

export interface SelectedOption {
  groupId: string
  groupName: string
  optionId: string
  optionName: string
  priceExtra: number
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
  options: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  address: string
  phone: string
  notes?: string
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'

export interface Favorite {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}
