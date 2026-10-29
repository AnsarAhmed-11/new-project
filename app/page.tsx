import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import TrustFeatures from "@/app/components/TrustFeatures";
import CategoryBar from "@/app/components/CategoryBar";
import FeaturedProducts from "@/app/components/FeaturedProducts";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <TrustFeatures />

      <CategoryBar />

      <FeaturedProducts />

      <Footer />
    </main>
  );
}
