import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import PopularHotels from "@/components/PopularHotels";
import Deals from "@/components/Deals";
import Trust from "@/components/Trust";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Destinations />
      <PopularHotels />
      <Deals />
      <Trust />
      <Footer />
    </main>
  );
};

export default Index;
