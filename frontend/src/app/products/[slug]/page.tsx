import api from '@/lib/api'

interface Product {
  id: string
  slug: string
}

export async function generateStaticParams() {
  try {
    const res = await api.get('/products?limit=100')
    const products: Product[] = res.data.products || res.data
    return products.map(product => ({ slug: product.slug }))
  } catch {
    return []
  }
}

export { default } from './ProductDetailClient'