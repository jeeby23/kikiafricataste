import ProductsHero from '@/components/products/ProductsHero'
import ProductList from '@/components/products/ProductList'
export default function ProductsPage() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-white">
      {/* Banner Section */}
      <ProductsHero />
      <ProductList/>
      {/* Product grid sections can be placed here down the line */}
    </main>
  )
}