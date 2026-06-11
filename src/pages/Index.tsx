import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import PopularHotels from "@/components/PopularHotels";
import Deals from "@/components/Deals";
import Trust from "@/components/Trust";
import Footer from "@/components/Footer";
import OperationsPanel from "@/components/OperationsPanel";
import type { SearchCriteria } from "@/lib/api";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 3);

const Index = () => {
  const [searchParams] = useSearchParams();

  const defaultCriteria = useMemo<SearchCriteria>(() => ({
    city: searchParams.get("city") || "Goa",
    checkIn: searchParams.get("checkIn") || format(tomorrow, "yyyy-MM-dd"),
    checkOut: searchParams.get("checkOut") || format(dayAfter, "yyyy-MM-dd"),
    adults: Number(searchParams.get("adults") || "2"),
    rooms: Number(searchParams.get("rooms") || "1"),
  }), [searchParams]);

  const [criteria, setCriteria] = useState<SearchCriteria>(defaultCriteria);

  useEffect(() => {
    setCriteria(defaultCriteria);
  }, [defaultCriteria]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero onSearch={setCriteria} />
      <Destinations />
      <PopularHotels criteria={criteria} />
      <OperationsPanel />
      <Deals />
      <Trust />
      <Footer />
    </main>
  );
};

export default Index;
