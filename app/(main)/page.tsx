import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StoreInfo from '@/components/home/StoreInfo'
import ShopByCategory from '@/components/home/ShopByCategory'
const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <ShopByCategory/>
      <StoreInfo/>
    </main>
  );
};

export default Home;