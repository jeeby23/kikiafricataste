import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StoreInfo from '@/components/home/StoreInfo'

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <StoreInfo/>
    </main>
  );
};

export default Home;