import heroImage from "@/assets/hero-hotel.jpg";
import SearchBar from "./SearchBar";
import type { SearchCriteria } from "@/lib/api";

type HeroProps = {
  onSearch: (criteria: SearchCriteria) => void;
};

const Hero = ({ onSearch }: HeroProps) => (
  <section className="relative min-h-[780px] md:min-h-[860px] flex flex-col overflow-hidden bg-background">
    <img
      src={heroImage}
      alt="Luxury infinity pool overlooking ocean at sunset"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 gradient-hero" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(22,72,128,0.18),_rgba(22,72,128,0.04)_45%,_rgba(255,255,255,0.08))]" />

    <div className="relative container mx-auto px-6 pt-32 pb-24 flex-1 flex flex-col">
      <div className="max-w-3xl text-white mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-semibold uppercase tracking-widest mb-6 text-white shadow-card">
          Over 1.2 Million stays worldwide
        </span>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.02] mb-6 text-white text-glow">
          Find your perfect <span className="text-accent">stay</span>, anywhere.
        </h1>
        <p className="text-lg md:text-xl text-white/86 max-w-2xl leading-relaxed">
          From budget-friendly rooms to luxury beach resorts, book the right hotel at the best price, instantly.
        </p>
      </div>

      <div className="mt-auto">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  </section>
);

export default Hero;
