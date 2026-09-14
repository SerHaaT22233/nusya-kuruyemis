export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: { products: number }
  parent?: Category
  children?: Category[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discountedPrice?: number
  sku: string
  unit: string
  stock: number
  images: string[]
  categoryId: string
  isActive: boolean
  isBestSeller: boolean
  isNew: boolean
  isOnSale: boolean
  isCampaign: boolean
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productSku: string
  unit: string
  quantity: number
  price: number
  totalPrice: number
}

export interface Coupon {
  id: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit?: number
  perUserLimit?: number
  usedCount: number
  isActive: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  discountAmount: number
  couponId?: string
  couponCode?: string
  shippingAddress: string
  city: string
  district: string
  phone: string
  email: string
  orderNote?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: {
    firstName?: string
    lastName?: string
    email: string
    phone?: string
  }
  coupon?: Coupon
}

export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone: string
  addressLine: string
  city: string
  district: string
  postalCode?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Favorite {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment?: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  user?: {
    firstName?: string
    lastName?: string
  }
  product?: {
    name: string
  }
}

export interface Banner {
  id: string
  title: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  title: string
  description?: string
  banner?: string
  discount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  products: {
    id: string
    product: Product
  }[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'ORDER' | 'SYSTEM' | 'PROMOTION' | 'INFO'
  isRead: boolean
  link?: string
  createdAt: string
}
