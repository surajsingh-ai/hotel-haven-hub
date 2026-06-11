import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import Header from "@/components/Header";
import PopularHotels from "@/components/PopularHotels";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import SortBar, { SortOption } from "@/components/SortBar";
import Footer from "@/components/Footer";
import type { SearchCriteria } from "@/lib/api";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 3);

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    ratings: [],
    amenities: [],
    hotelType: [],
  });

  const criteria = useMemo<SearchCriteria>(() => ({
    city: searchParams.get("city") || "Goa",
    checkIn: searchParams.get("checkIn") || format(tomorrow, "yyyy-MM-dd"),
    checkOut: searchParams.get("checkOut") || format(dayAfter, "yyyy-MM-dd"),
    adults: Number(searchParams.get("adults") || "2"),
    rooms: Number(searchParams.get("rooms") || "1"),
  }), [searchParams]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Search Summary */}
      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="text-accent text-xs font-bold uppercase tracking-widest">Search results</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-foreground dark:text-white">
            Hotels in {criteria.city}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground dark:text-white/70">
            {format(new Date(criteria.checkIn), "dd MMM")} → {format(new Date(criteria.checkOut), "dd MMM")} · {criteria.rooms} room · {criteria.adults} guests
          </p>
        </div>
      </section>

      {/* Filters, Sort & Results */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <SortBar sortBy={sortBy} onSortChange={setSortBy} hotelCount={0} />
            <PopularHotels criteria={criteria} filters={filters} sortBy={sortBy} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SearchResults;

