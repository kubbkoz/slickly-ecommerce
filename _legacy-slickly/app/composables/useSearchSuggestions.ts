import { products, searchProducts, type Product } from '~/data/products'

const recommended: Product[] = products.filter((p) => p.badge).slice(0, 4)

const featured: Product[] = [...products]
  .map((p) => ({
    product: p,
    avg: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
  }))
  .sort((a, b) => b.avg - a.avg)
  .slice(0, 4)
  .map((x) => x.product)

export function useSearchSuggestions(query: Ref<string>) {
  const results = computed(() => searchProducts(query.value))

  return { results, recommended, featured }
}
