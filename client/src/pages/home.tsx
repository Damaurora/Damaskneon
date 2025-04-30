import HeroSection from "@/components/home/hero-section";
import NewsSection from "@/components/home/news-section";
import TopProducts from "@/components/home/top-products";
import CatalogSection from "@/components/home/catalog-section";
import LocationsSection from "@/components/home/locations-section";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NewsSection />
        <TopProducts />
        <CatalogSection />
        <LocationsSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
